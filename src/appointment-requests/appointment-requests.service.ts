import { HttpException, Injectable } from '@nestjs/common';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { PrismaService } from 'src/prisma.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Injectable()
export class AppointmentRequestsService {
  constructor(
    private prisma: PrismaService,
    private appointmentsService: AppointmentsService,
    private encryption: EncryptionService,
  ) {}

  async getLandingCalendar() {
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // Monday=0
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);

    const endNextSunday = new Date(nextMonday);
    endNextSunday.setDate(nextMonday.getDate() + 6);
    endNextSunday.setHours(23, 59, 59, 999);

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

        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + index);

        const h = shift.hour.getHours();
        const m = shift.hour.getMinutes();

        const slotStart = new Date(dayDate);
        slotStart.setHours(h, m, 0, 0);

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
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekAppointments = appointments.filter(
        (a) => a.dateHour >= weekStart && a.dateHour <= weekEnd,
      );

      for (const a of weekAppointments) {
        const apptStart = new Date(a.dateHour);
        const apptEnd = new Date(apptStart);
        apptEnd.setMinutes(apptEnd.getMinutes() + a.minutesDuration);

        const dayIndex = apptStart.getDay() === 0 ? 6 : apptStart.getDay() - 1;
        const key = dayKeys[dayIndex];

        for (const slot of weekSchedule[key]) {
          const slotStart = new Date(slot.dateHour);
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);

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
    const encrypted = {
      ...request,
      patientFullName: this.encryption.encrypt(request.patientFullName),
      phoneNumber: this.encryption.encrypt(request.phoneNumber),
      message: this.encryption.encrypt(request.message),
    };

    return this.prisma.appointmentrequest.create({
      data: encrypted,
    });
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
        updateDate: new Date(),
        AppUser_Id: userID,
      },
    });
    return updated;
  }
}
