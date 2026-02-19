import { HttpException, Injectable } from '@nestjs/common';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';
import { utcDate, utcNow } from 'src/utils/utc-date';

@Injectable()
export class AppointmentRequestsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async getLandingCalendar() {
    const now = utcNow();
    const dayOfWeek = now.getUTCDay() === 0 ? 6 : now.getUTCDay() - 1; // Monday=0
    const monday = utcDate(now);
    monday.setUTCDate(now.getUTCDate() - dayOfWeek);
    monday.setUTCHours(0, 0, 0, 0);

    const nextMonday = utcDate(monday);
    nextMonday.setUTCDate(monday.getUTCDate() + 7);

    const endNextSunday = utcDate(nextMonday);
    endNextSunday.setUTCDate(nextMonday.getUTCDate() + 6);
    endNextSunday.setUTCHours(23, 59, 59, 999);

    const [shifts, appointments] = await Promise.all([
      this.prisma.shift.findMany({
        select: { day: true, hour: true, status: true },
      }),
      this.prisma.appointment.findMany({
        where: {
          status: true,
          dateHour: { gte: monday, lte: endNextSunday },
        },
        select: { dateHour: true, minutesDuration: true },
      }),
    ]);

    const dayKeys = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ] as const;

    const dbDayToIndex: Record<string, number> = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6,
    };

    const initWeek = () => ({
      monday: [] as { dateHour: Date; status: boolean }[],
      tuesday: [] as { dateHour: Date; status: boolean }[],
      wednesday: [] as { dateHour: Date; status: boolean }[],
      thursday: [] as { dateHour: Date; status: boolean }[],
      friday: [] as { dateHour: Date; status: boolean }[],
      saturday: [] as { dateHour: Date; status: boolean }[],
      sunday: [] as { dateHour: Date; status: boolean }[],
    });

    const buildWeek = (weekStart: Date) => {
      const schedule = initWeek();

      for (const shift of shifts) {
        const index = dbDayToIndex[shift.day];
        if (index === undefined) continue;

        const dayDate = utcDate(weekStart);
        dayDate.setUTCDate(weekStart.getUTCDate() + index);

        const h = shift.hour.getUTCHours();
        const m = shift.hour.getUTCMinutes();

        const slotStart = utcDate(dayDate);
        slotStart.setUTCHours(h, m, 0, 0);

        schedule[dayKeys[index]].push({
          dateHour: slotStart,
          status: !!shift.status,
        });
      }

      dayKeys.forEach((key) =>
        schedule[key].sort(
          (a, b) => a.dateHour.getTime() - b.dateHour.getTime(),
        ),
      );

      return schedule;
    };

    const markAppointments = (
      weekStart: Date,
      weekSchedule: ReturnType<typeof initWeek>,
    ) => {
      const weekEnd = utcDate(weekStart);
      weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
      weekEnd.setUTCHours(23, 59, 59, 999);

      const weekAppointments = appointments.filter(
        (a) => a.dateHour >= weekStart && a.dateHour <= weekEnd,
      );

      for (const a of weekAppointments) {
        const apptStart = utcDate(a.dateHour);
        const apptEnd = utcDate(apptStart);
        apptEnd.setUTCMinutes(apptEnd.getUTCMinutes() + a.minutesDuration);

        const dayIndex =
          apptStart.getUTCDay() === 0 ? 6 : apptStart.getUTCDay() - 1;
        const key = dayKeys[dayIndex];

        for (const slot of weekSchedule[key]) {
          const slotStart = utcDate(slot.dateHour);
          const slotEnd = utcDate(slotStart);
          slotEnd.setUTCMinutes(slotEnd.getUTCMinutes() + 30);

          if (slotStart < apptEnd && slotEnd > apptStart) {
            slot.status = false;
          }
        }
      }
    };

    const markPastSlots = (weekSchedule: ReturnType<typeof initWeek>) => {
      dayKeys.forEach((key) => {
        for (const slot of weekSchedule[key]) {
          if (slot.dateHour < now) {
            slot.status = false;
          }
        }
      });
    };

    const currentWeek = buildWeek(monday);
    const nextWeek = buildWeek(nextMonday);

    markAppointments(monday, currentWeek);
    markAppointments(nextMonday, nextWeek);
    markPastSlots(currentWeek);

    return { currentWeek, nextWeek };
  }

  async getWaNumber() {
    const waNumber = await this.prisma.appuser.findFirst({
      orderBy: { registerDate: 'asc' },
      select: { phoneNumber: true },
    });
    return waNumber?.phoneNumber;
  }

  async sendRequest(request: CreateAppointmentRequestDto) {
    const requestedDate = utcDate(request.dateHourRequest);
    const requestedEnd = utcDate(requestedDate);
    requestedEnd.setUTCMinutes(requestedEnd.getUTCMinutes() + 30); // slots de 30min

    // Verificar si ya existe una cita en ese horario
    const overlappingAppointment = await this.prisma.appointment.findFirst({
      where: {
        status: true,
        dateHour: {
          lt: requestedEnd,
        },
      },
      select: { dateHour: true, minutesDuration: true },
    });

    if (overlappingAppointment) {
      const apptEnd = utcDate(overlappingAppointment.dateHour);
      apptEnd.setUTCMinutes(
        apptEnd.getUTCMinutes() + overlappingAppointment.minutesDuration,
      );
      if (apptEnd > requestedDate) {
        throw new HttpException('Slot not available', 409);
      }
    }

    // // Verificar si ya existe una solicitud pendiente en ese horario
    // const existingRequest = await this.prisma.appointmentrequest.findFirst({
    //   where: {
    //     dateHourRequest: request.dateHourRequest,
    //     status: true,
    //   },
    // });

    // if (existingRequest) {
    //   throw new HttpException('Request already exists for this slot', 409);
    // }

    const encrypted = {
      ...request,
      patientFullName: this.encryption.encrypt(request.patientFullName),
      phoneNumber: this.encryption.encrypt(request.phoneNumber),
      message: this.encryption.encrypt(request.message),
    };

    const created = await this.prisma.appointmentrequest.create({
      data: encrypted,
    });
    return created;
  }

  async findAll() {
    const dbRequests = await this.prisma.appointmentrequest.findMany({
      where: { status: true },
      orderBy: { registerDate: 'desc' },
      select: {
        Id: true,
        patientFullName: true,
        dateHourRequest: true,
        phoneNumber: true,
        message: true,
        appuser: {
          select: {
            Id: true,
            username: true,
          },
        },
        registerDate: true,
        status: true,
        updateDate: true,
      },
    });
    return dbRequests.map((request) => ({
      ...request,
      patientFullName: this.encryption.decrypt(request.patientFullName),
      phoneNumber: this.encryption.decrypt(request.phoneNumber),
      message: this.encryption.decrypt(request.message),
    }));
  }

  async findAllPast() {
    const dbRequests = await this.prisma.appointmentrequest.findMany({
      where: { status: false },
      select: {
        Id: true,
        patientFullName: true,
        dateHourRequest: true,
        phoneNumber: true,
        message: true,
        appuser: {
          select: {
            Id: true,
            username: true,
          },
        },
        registerDate: true,
        status: true,
        updateDate: true,
      },
    });

    return dbRequests.map((request) => ({
      ...request,
      patientFullName: this.encryption.decrypt(request.patientFullName),
      phoneNumber: this.encryption.decrypt(request.phoneNumber),
      message: this.encryption.decrypt(request.message),
    }));
  }

  async findOne(id: number) {
    const dbRequest = await this.prisma.appointmentrequest.findUnique({
      where: { Id: id },
      select: {
        Id: true,
        patientFullName: true,
        dateHourRequest: true,
        phoneNumber: true,
        message: true,
        appuser: {
          select: {
            Id: true,
            username: true,
          },
        },
        registerDate: true,
        status: true,
        updateDate: true,
      },
    });
    if (!dbRequest) throw new HttpException('Request not found', 404);
    return {
      ...dbRequest,
      patientFullName: this.encryption.decrypt(dbRequest.patientFullName),
      phoneNumber: this.encryption.decrypt(dbRequest.phoneNumber),
      message: this.encryption.decrypt(dbRequest.message),
    };
  }

  async denyRequest(id: number, userID: number) {
    const updated = await this.prisma.appointmentrequest.update({
      where: { Id: id, status: true },
      data: {
        status: false,
        updateDate: utcNow(),
        AppUser_Id: userID,
      },
    });
    return updated;
  }
}
