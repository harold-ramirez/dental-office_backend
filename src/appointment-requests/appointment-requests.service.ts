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
    const nowUtc = utcNow();
    const boliviaOffsetMinutes = -4 * 60;
    const toBoliviaDate = (value: Date) =>
      new Date(value.getTime() + boliviaOffsetMinutes * 60 * 1000);
    const fromBoliviaDate = (value: Date) =>
      new Date(value.getTime() - boliviaOffsetMinutes * 60 * 1000);

    const nowBolivia = toBoliviaDate(nowUtc);
    const dayOfWeek =
      nowBolivia.getUTCDay() === 0 ? 6 : nowBolivia.getUTCDay() - 1; // Monday=0

    const mondayBolivia = utcDate(nowBolivia);
    mondayBolivia.setUTCDate(nowBolivia.getUTCDate() - dayOfWeek);
    mondayBolivia.setUTCHours(0, 0, 0, 0);

    const nextMondayBolivia = utcDate(mondayBolivia);
    nextMondayBolivia.setUTCDate(mondayBolivia.getUTCDate() + 7);

    const endNextSundayBolivia = utcDate(nextMondayBolivia);
    endNextSundayBolivia.setUTCDate(nextMondayBolivia.getUTCDate() + 6);
    endNextSundayBolivia.setUTCHours(23, 59, 59, 999);

    const mondayUtc = fromBoliviaDate(mondayBolivia);
    const endNextSundayUtc = fromBoliviaDate(endNextSundayBolivia);

    const [shifts, appointments] = await Promise.all([
      this.prisma.shift.findMany({
        select: { day: true, hour: true, status: true },
      }),
      this.prisma.appointment.findMany({
        where: {
          status: true,
          dateHour: { gte: mondayUtc, lte: endNextSundayUtc },
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

    const buildWeek = (weekStartBolivia: Date) => {
      const schedule = initWeek();

      for (const shift of shifts) {
        const index = dbDayToIndex[shift.day];
        if (index === undefined) continue;

        const dayDateBolivia = utcDate(weekStartBolivia);
        dayDateBolivia.setUTCDate(weekStartBolivia.getUTCDate() + index);

        const h = shift.hour.getUTCHours();
        const m = shift.hour.getUTCMinutes();

        const slotStartUtc = utcDate(dayDateBolivia);
        slotStartUtc.setUTCHours(h, m, 0, 0);

        schedule[dayKeys[index]].push({
          dateHour: slotStartUtc,
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
      weekStartBolivia: Date,
      weekSchedule: ReturnType<typeof initWeek>,
    ) => {
      const weekEndBolivia = utcDate(weekStartBolivia);
      weekEndBolivia.setUTCDate(weekStartBolivia.getUTCDate() + 6);
      weekEndBolivia.setUTCHours(23, 59, 59, 999);

      const weekAppointments = appointments.filter((a) => {
        const apptBolivia = toBoliviaDate(a.dateHour);
        return apptBolivia >= weekStartBolivia && apptBolivia <= weekEndBolivia;
      });

      for (const a of weekAppointments) {
        const apptStart = utcDate(a.dateHour);
        const apptEnd = utcDate(apptStart);
        apptEnd.setUTCMinutes(apptEnd.getUTCMinutes() + a.minutesDuration);

        const apptStartBolivia = toBoliviaDate(apptStart);

        const dayIndex =
          apptStartBolivia.getUTCDay() === 0
            ? 6
            : apptStartBolivia.getUTCDay() - 1;
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
      const minAdvanceMs = 3 * 60 * 60 * 1000; // 3 horas de anticipación mínima
      const minSlotTime = new Date(nowUtc.getTime() + minAdvanceMs);

      // Obtener el día actual en Bolivia
      const nowBoliviaLocal = toBoliviaDate(nowUtc);
      const todayBolivia = new Date(nowBoliviaLocal);
      todayBolivia.setUTCHours(0, 0, 0, 0);

      dayKeys.forEach((key) => {
        for (const slot of weekSchedule[key]) {
          // Convertir slot a hora Bolivia para comparar día
          const slotBolivia = toBoliviaDate(slot.dateHour);
          const slotDayBolivia = new Date(slotBolivia);
          slotDayBolivia.setUTCHours(0, 0, 0, 0);

          // Si es el día de hoy en Bolivia, aplicar restricción de 3 horas
          if (slotDayBolivia.getTime() === todayBolivia.getTime()) {
            if (slot.dateHour < minSlotTime) {
              slot.status = false;
            }
          } else if (slot.dateHour < nowUtc) {
            // Para otros días, solo marcar si ya pasó
            slot.status = false;
          }
        }
      });
    };

    const currentWeek = buildWeek(mondayBolivia);
    const nextWeek = buildWeek(nextMondayBolivia);

    markAppointments(mondayBolivia, currentWeek);
    markAppointments(nextMondayBolivia, nextWeek);
    markPastSlots(currentWeek);

    return { currentWeek, nextWeek };
  }

  async getWaNumber() {
    const waNumber = await this.prisma.appuser.findFirst({
      orderBy: { registerDate: 'asc' },
      select: { phoneNumber: true },
    });
    if (!waNumber?.phoneNumber) return undefined;
    return this.encryption.decrypt(waNumber.phoneNumber);
  }

  async sendRequest(request: CreateAppointmentRequestDto) {
    const requestedDate = utcDate(request.dateHourRequest);
    const nowUtc = utcNow();

    // Validar antelación mínima de 3 horas
    const minAdvanceMs = 3 * 60 * 60 * 1000;
    if (requestedDate.getTime() - nowUtc.getTime() < minAdvanceMs) {
      throw new HttpException(
        'La cita debe solicitarse con al menos 3 horas de anticipación',
        400,
      );
    }

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

  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [dbRequests, total] = await Promise.all([
      this.prisma.appointmentrequest.findMany({
        where: { status: true },
        orderBy: { registerDate: 'desc' },
        skip,
        take: pageSize,
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
      }),
      this.prisma.appointmentrequest.count({
        where: { status: true },
      }),
    ]);

    return dbRequests.map((request) => ({
      ...request,
      patientFullName: this.encryption.decrypt(request.patientFullName),
      phoneNumber: this.encryption.decrypt(request.phoneNumber),
      message: this.encryption.decrypt(request.message),
    }));
  }

  async findAllPast(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [dbRequests, total] = await Promise.all([
      this.prisma.appointmentrequest.findMany({
        where: { status: false },
        skip,
        take: pageSize,
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
      }),
      this.prisma.appointmentrequest.count({
        where: { status: false },
      }),
    ]);

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
