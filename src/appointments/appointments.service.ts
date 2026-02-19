import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateAppointmentDto,
  WeekScheduleDto,
} from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';
import { utcDate, utcFromParts, utcNow } from 'src/utils/utc-date';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async summary() {
    const now = utcNow();
    // Today
    const startOfToday = utcDate(now);
    startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = utcDate(now);
    endOfToday.setUTCHours(23, 59, 59, 999);
    // Tomorrow
    const startOfTomorrow = utcDate(now);
    startOfTomorrow.setUTCDate(now.getUTCDate() + 1);
    startOfTomorrow.setUTCHours(0, 0, 0, 0);
    const endOfTomorrow = utcDate(startOfTomorrow);
    endOfTomorrow.setUTCHours(23, 59, 59, 999);
    // Current Week
    const dayOfWeek = now.getUTCDay() === 0 ? 6 : now.getUTCDay() - 1;
    const monday = utcDate(now);
    monday.setUTCDate(now.getUTCDate() - dayOfWeek);
    monday.setUTCHours(0, 0, 0, 0);
    const sunday = utcDate(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    sunday.setUTCHours(23, 59, 59, 999);

    const [
      todayCount,
      tomorrowCount,
      weekCount,
      weekAppointments,
      pendingRequests,
    ] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          status: true,
          dateHour: { gte: startOfToday, lte: endOfToday },
        },
      }),
      this.prisma.appointment.count({
        where: {
          status: true,
          dateHour: { gte: startOfTomorrow, lte: endOfTomorrow },
        },
      }),
      this.prisma.appointment.count({
        where: {
          status: true,
          dateHour: { gte: monday, lte: sunday },
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          status: true,
          dateHour: { gte: monday, lte: sunday },
        },
        select: {
          dateHour: true,
        },
      }),
      this.prisma.appointmentrequest.count({
        where: {
          status: true,
        },
      }),
    ]);

    const daysCountArray = [0, 0, 0, 0, 0, 0, 0]; // [Sunday, Monday, ..., Saturday]

    weekAppointments.forEach((appointment) => {
      const dayIndex = appointment.dateHour.getUTCDay();
      daysCountArray[dayIndex]++;
    });

    return {
      today: todayCount,
      tomorrow: tomorrowCount,
      currentWeek: weekCount,
      currentWeekByDay: daysCountArray,
      pendingRequests: pendingRequests,
    };
  }

  async preview(patientId: number) {
    const dbPreview = await this.prisma.appointment.findMany({
      take: 5,
      orderBy: { dateHour: 'desc' },
      where: { Patient_Id: patientId, status: true },
      select: {
        dateHour: true,
        treatment: {
          select: {
            name: true,
          },
        },
      },
    });
    const preview: { dateHour: Date; treatment: string | null }[] =
      dbPreview.map((appointment) => {
        return {
          dateHour: appointment.dateHour,
          treatment: appointment.treatment?.name ?? null,
        };
      });
    return preview;
  }

  async history(patientId: number) {
    const now = utcNow();
    const startOfCurrentMonth = utcFromParts(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1,
    );
    const lastMonthDate = utcFromParts(
      now.getUTCFullYear(),
      now.getUTCMonth() - 1,
      1,
    );
    const endOfCurrentMonth = utcFromParts(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const startOfLastMonth = utcFromParts(
      lastMonthDate.getUTCFullYear(),
      lastMonthDate.getUTCMonth(),
      1,
    );
    const endOfLastMonth = utcFromParts(
      lastMonthDate.getUTCFullYear(),
      lastMonthDate.getUTCMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const mapAppointmentToDto = (appointment) => ({
      dateHour: appointment.dateHour,
      minutesDuration: appointment.minutesDuration,
      requestMessage: appointment.appointmentrequest?.message
        ? this.encryption.decrypt(appointment.appointmentrequest.message)
        : null,
      treatment: appointment.treatment?.name ?? null,
      notes: appointment.notes
        ? this.encryption.decrypt(appointment.notes)
        : null,
    });

    const appointmentSelect = {
      dateHour: true,
      minutesDuration: true,
      notes: true,
      appointmentrequest: {
        select: {
          message: true,
        },
      },
      treatment: {
        select: {
          name: true,
        },
      },
    };

    const [last10, currentMonth, lastMonth, all] = await Promise.all([
      this.prisma.appointment.findMany({
        take: 10,
        orderBy: { dateHour: 'desc' },
        select: appointmentSelect,
        where: { Patient_Id: patientId, status: true },
      }),
      this.prisma.appointment.findMany({
        orderBy: { dateHour: 'desc' },
        select: appointmentSelect,
        where: {
          Patient_Id: patientId,
          status: true,
          dateHour: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
      }),
      this.prisma.appointment.findMany({
        orderBy: { dateHour: 'desc' },
        select: appointmentSelect,
        where: {
          Patient_Id: patientId,
          status: true,
          dateHour: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
      this.prisma.appointment.findMany({
        orderBy: { dateHour: 'desc' },
        select: appointmentSelect,
        where: {
          Patient_Id: patientId,
          status: true,
        },
      }),
    ]);

    return {
      last10Appointments: last10.map(mapAppointmentToDto),
      currentMonthAppointments: currentMonth.map(mapAppointmentToDto),
      lastMonthAppointments: lastMonth.map(mapAppointmentToDto),
      allAppointments: all.map(mapAppointmentToDto),
    };
  }

  async findAllDay(date: string) {
    const day = date.split('T')[0];
    const start = utcDate(day + 'T00:00:00Z');
    const end = utcDate(day + 'T23:59:59.999Z');

    const appointments = await this.prisma.appointment.findMany({
      orderBy: { dateHour: 'asc' },
      where: {
        status: true,
        dateHour: {
          gte: start,
          lte: end,
        },
      },
      select: {
        Id: true,
        dateHour: true,
        notes: true,
        minutesDuration: true,
        treatment: {
          select: {
            Id: true,
            name: true,
          },
        },
        appointmentrequest: {
          select: {
            message: true,
            phoneNumber: true,
            patientFullName: true,
          },
        },
        patient: {
          select: {
            Id: true,
            name: true,
            paternalSurname: true,
            maternalSurname: true,
            cellphoneNumber: true,
          },
        },
      },
    });
    const dto: any[] = [];
    for (const appointment of appointments) {
      dto.push({
        Id: appointment.Id,
        dateHour: appointment.dateHour,
        treatment: appointment.treatment?.name ?? null,
        treatmentID: appointment.treatment?.Id ?? null,
        patientID: appointment.patient?.Id,
        minutesDuration: appointment.minutesDuration,
        notes: appointment.notes
          ? this.encryption.decrypt(appointment.notes)
          : null,
        requestMessage: appointment.appointmentrequest?.message
          ? this.encryption.decrypt(appointment.appointmentrequest.message)
          : null,
        requestPhoneNumber: appointment.appointmentrequest?.phoneNumber
          ? this.encryption.decrypt(appointment.appointmentrequest.phoneNumber)
          : null,
        patientPhoneNumber: appointment.patient?.cellphoneNumber
          ? this.encryption.decrypt(appointment.patient.cellphoneNumber)
          : null,
        patient: appointment.patient
          ? [
              this.encryption.decrypt(appointment.patient.name),
              appointment.patient.paternalSurname
                ? this.encryption.decrypt(appointment.patient.paternalSurname)
                : null,
              appointment.patient.maternalSurname
                ? this.encryption.decrypt(appointment.patient.maternalSurname)
                : null,
            ]
              .filter(Boolean)
              .join(' ')
          : appointment.appointmentrequest?.patientFullName
            ? this.encryption.decrypt(
                appointment.appointmentrequest.patientFullName,
              )
            : null,
      });
    }
    return dto;
  }

  async findAllWeek() {
    const now = utcNow();
    const dayOfWeek = now.getUTCDay() === 0 ? 6 : now.getUTCDay() - 1;

    // Current week (Monday to Sunday)
    const currentMonday = utcDate(now);
    currentMonday.setUTCDate(now.getUTCDate() - dayOfWeek);
    currentMonday.setUTCHours(0, 0, 0, 0);

    const currentSunday = utcDate(currentMonday);
    currentSunday.setUTCDate(currentMonday.getUTCDate() + 6);
    currentSunday.setUTCHours(23, 59, 59, 999);

    // Next week (Monday to Sunday)
    const nextMonday = utcDate(currentMonday);
    nextMonday.setUTCDate(currentMonday.getUTCDate() + 7);
    nextMonday.setUTCHours(0, 0, 0, 0);

    const nextSunday = utcDate(nextMonday);
    nextSunday.setUTCDate(nextMonday.getUTCDate() + 6);
    nextSunday.setUTCHours(23, 59, 59, 999);

    const data = await this.prisma.appointment.findMany({
      orderBy: { dateHour: 'asc' },
      where: {
        status: true,
        dateHour: {
          gte: currentMonday,
          lte: nextSunday,
        },
      },
      select: {
        Id: true,
        dateHour: true,
        minutesDuration: true,
        notes: true,
        treatment: {
          select: {
            Id: true,
            name: true,
          },
        },
        appointmentrequest: {
          select: {
            Id: true,
            message: true,
            phoneNumber: true,
            patientFullName: true,
            registerDate: true,
          },
        },
        patient: {
          select: {
            Id: true,
            name: true,
            paternalSurname: true,
            maternalSurname: true,
            cellphoneNumber: true,
          },
        },
      },
    });

    // Inicializar objetos con los días de la semana para semana actual y siguiente
    const currentWeekSchedule: WeekScheduleDto = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    const nextWeekSchedule: WeekScheduleDto = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    // Mapear cada appointment al día correspondiente
    data.forEach((appointment) => {
      const appointmentDay = appointment.dateHour.getUTCDay();
      const dto = {
        Id: appointment.Id,
        dateHour: appointment.dateHour,
        requestID: appointment.appointmentrequest?.Id ?? null,
        requestRegisterDate:
          appointment.appointmentrequest?.registerDate ?? null,
        minutesDuration: appointment.minutesDuration,
        notes: appointment.notes
          ? this.encryption.decrypt(appointment.notes)
          : null,
        treatment: appointment.treatment?.name ?? null,
        treatmentID: appointment.treatment?.Id ?? null,
        requestMessage: appointment.appointmentrequest?.message
          ? this.encryption.decrypt(appointment.appointmentrequest.message)
          : null,
        requestPhoneNumber: appointment.appointmentrequest?.phoneNumber ?? null,
        patientID: appointment.patient?.Id,
        patientPhoneNumber: appointment.patient?.cellphoneNumber
          ? this.encryption.decrypt(appointment.patient.cellphoneNumber)
          : null,
        patient: appointment.patient
          ? [
              this.encryption.decrypt(appointment.patient.name),
              appointment.patient.paternalSurname
                ? this.encryption.decrypt(appointment.patient.paternalSurname)
                : null,
              appointment.patient.maternalSurname
                ? this.encryption.decrypt(appointment.patient.maternalSurname)
                : null,
            ]
              .filter(Boolean)
              .join(' ')
          : appointment.appointmentrequest?.patientFullName
            ? this.encryption.decrypt(
                appointment.appointmentrequest.patientFullName,
              )
            : null,
      };

      // Determinar si la cita pertenece a la semana actual o siguiente
      const isCurrentWeek =
        appointment.dateHour >= currentMonday &&
        appointment.dateHour <= currentSunday;
      const targetSchedule = isCurrentWeek
        ? currentWeekSchedule
        : nextWeekSchedule;

      switch (appointmentDay) {
        case 1:
          targetSchedule.monday.push(dto);
          break;
        case 2:
          targetSchedule.tuesday.push(dto);
          break;
        case 3:
          targetSchedule.wednesday.push(dto);
          break;
        case 4:
          targetSchedule.thursday.push(dto);
          break;
        case 5:
          targetSchedule.friday.push(dto);
          break;
        case 6:
          targetSchedule.saturday.push(dto);
          break;
        case 0:
          targetSchedule.sunday.push(dto);
          break;
      }
    });

    return {
      currentWeek: currentWeekSchedule,
      nextWeek: nextWeekSchedule,
    };
  }

  async findAllMonth() {
    const now = utcNow();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    // Current month
    const currentMonthStart = utcFromParts(year, month, 1, 0, 0, 0, 0);
    const currentMonthEnd = utcFromParts(year, month + 1, 0, 23, 59, 59, 999);

    // Next month
    const nextMonthDate = utcFromParts(year, month + 1, 1);
    const nextMonthStart = utcFromParts(
      nextMonthDate.getUTCFullYear(),
      nextMonthDate.getUTCMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const nextMonthEnd = utcFromParts(
      nextMonthDate.getUTCFullYear(),
      nextMonthDate.getUTCMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const grouped = await this.prisma.appointment.groupBy({
      by: ['dateHour'],
      where: {
        status: true,
        dateHour: {
          gte: currentMonthStart,
          lte: nextMonthEnd,
        },
      },
      _count: {
        dateHour: true,
      },
    });

    const currentMonthMap = new Map<string, number>();
    const nextMonthMap = new Map<string, number>();

    grouped.forEach((item) => {
      const dayStart = utcDate(item.dateHour);
      dayStart.setUTCHours(0, 0, 0, 0);
      const dayIso = dayStart.toISOString();

      // Determinar si pertenece al mes actual o siguiente
      const isCurrentMonth =
        item.dateHour >= currentMonthStart && item.dateHour <= currentMonthEnd;
      const targetMap = isCurrentMonth ? currentMonthMap : nextMonthMap;

      targetMap.set(
        dayIso,
        (targetMap.get(dayIso) || 0) + item._count.dateHour,
      );
    });

    const currentMonth: { day: string; count: number }[] = [];
    const nextMonth: { day: string; count: number }[] = [];

    currentMonthMap.forEach((count, dayIso) => {
      currentMonth.push({ day: dayIso, count });
    });

    nextMonthMap.forEach((count, dayIso) => {
      nextMonth.push({ day: dayIso, count });
    });

    return {
      currentMonth,
      nextMonth,
    };
  }

  async findOne(id: number) {
    const dbAppointment = await this.prisma.appointment.findUnique({
      where: { Id: id, status: true },
      select: {
        Id: true,
        dateHour: true,
        notes: true,
        minutesDuration: true,
        registerDate: true,
        updateDate: true,
        treatment: {
          select: {
            Id: true,
            name: true,
          },
        },
        appointmentrequest: {
          select: {
            Id: true,
            patientFullName: true,
            dateHourRequest: true,
            message: true,
            registerDate: true,
            status: true,
          },
        },
        patient: {
          select: {
            Id: true,
            name: true,
            paternalSurname: true,
            maternalSurname: true,
            cellphoneNumber: true,
          },
        },
        appuser: {
          select: {
            Id: true,
            username: true,
          },
        },
      },
    });
    if (!dbAppointment) throw new HttpException('Appointment not found', 404);
    return {
      ...dbAppointment,
      cellPhoneNumber: dbAppointment.patient?.cellphoneNumber
        ? this.encryption.decrypt(dbAppointment.patient.cellphoneNumber)
        : null,
      patientID: dbAppointment.patient?.Id,
      patientName: dbAppointment.patient
        ? [
            this.encryption.decrypt(dbAppointment.patient.name),
            dbAppointment.patient.paternalSurname
              ? this.encryption.decrypt(dbAppointment.patient.paternalSurname)
              : null,
            dbAppointment.patient.maternalSurname
              ? this.encryption.decrypt(dbAppointment.patient.maternalSurname)
              : null,
          ]
            .filter(Boolean)
            .join(' ')
        : dbAppointment.appointmentrequest
          ? this.encryption.decrypt(
              dbAppointment.appointmentrequest.patientFullName,
            )
          : null,
      appointmentrequest: {
        ...dbAppointment.appointmentrequest,
        message: dbAppointment.appointmentrequest?.message
          ? this.encryption.decrypt(dbAppointment.appointmentrequest.message)
          : null,
      },
      notes: dbAppointment.notes
        ? this.encryption.decrypt(dbAppointment.notes)
        : null,
    };
  }

  async create(body: CreateAppointmentDto, userID: number) {
    const start = utcDate(body.dateHour);
    const end = utcDate(start);
    end.setUTCMinutes(end.getUTCMinutes() + body.minutesDuration);
    const overlaps = await this.prisma.appointment.findMany({
      where: {
        status: true,
        dateHour: { lt: end },
      },
      select: { Id: true, dateHour: true, minutesDuration: true },
    });

    const hasOverlap = overlaps.some((a) => {
      const aEnd = utcDate(a.dateHour);
      aEnd.setUTCMinutes(aEnd.getUTCMinutes() + a.minutesDuration);
      return aEnd > start;
    });

    if (hasOverlap) {
      throw new HttpException('Appointment overlaps another one', 409);
    }
    const created = await this.prisma.$transaction(async (tx) => {
      if (body.AppointmentRequest_Id) {
        await tx.appointmentrequest.update({
          where: { Id: body.AppointmentRequest_Id, status: true },
          data: {
            status: false,
            updateDate: utcNow(),
            AppUser_Id: userID,
          },
        });
      }
      const created = await tx.appointment.create({
        data: {
          ...body,
          AppUser_Id: userID,
          notes: body.notes ? this.encryption.encrypt(body.notes) : null,
        },
      });
      return created;
    });

    return created;
  }

  async update(id: number, body: UpdateAppointmentDto, userID: number) {
    const start = utcDate(body.dateHour);
    const end = utcDate(start);
    end.setUTCMinutes(end.getUTCMinutes() + body.minutesDuration);

    const overlaps = await this.prisma.appointment.findMany({
      where: {
        status: true,
        Id: { not: id },
        dateHour: { lt: end },
      },
      select: { Id: true, dateHour: true, minutesDuration: true },
    });

    const hasOverlap = overlaps.some((a) => {
      const aEnd = utcDate(a.dateHour);
      aEnd.setUTCMinutes(aEnd.getUTCMinutes() + a.minutesDuration);
      return aEnd > start;
    });

    if (hasOverlap) {
      throw new HttpException('Appointment overlaps another one', 409);
    }

    return this.prisma.appointment.update({
      where: { Id: id, status: true },
      data: {
        ...body,
        notes: body.notes ? this.encryption.encrypt(body.notes) : null,
        updateDate: utcNow(),
        AppUser_Id: userID,
      },
    });
  }

  async softDelete(id: number, userID: number) {
    return this.prisma.appointment.update({
      where: { Id: id, status: true },
      data: {
        status: false,
        updateDate: utcNow(),
        AppUser_Id: userID,
      },
    });
  }
}
