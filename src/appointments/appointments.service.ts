import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateAppointmentDto,
  WeekScheduleDto,
} from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async summary() {
    const now = new Date();
    // Today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    // Tomorrow
    const startOfTomorrow = new Date(now);
    startOfTomorrow.setDate(now.getDate() + 1);
    startOfTomorrow.setHours(0, 0, 0, 0);
    const endOfTomorrow = new Date(startOfTomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);
    // Current Week
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

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
      const dayIndex = appointment.dateHour.getDay();
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
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const startOfLastMonth = new Date(
      lastMonthDate.getFullYear(),
      lastMonthDate.getMonth(),
      1,
    );
    const endOfLastMonth = new Date(
      lastMonthDate.getFullYear(),
      lastMonthDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const mapAppointmentToDto = (appointment) => ({
      dateHour: appointment.dateHour,
      minutesDuration: appointment.minutesDuration,
      requestMessage: appointment.appointmentrequest.message
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
    const start = new Date(day + 'T00:00:00');
    const end = new Date(day + 'T23:59:59.999');

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
        patientID: appointment.patient.Id,
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
        patientPhoneNumber: appointment.patient.cellphoneNumber
          ? this.encryption.decrypt(appointment.patient.cellphoneNumber)
          : null,
        patient: [
          this.encryption.decrypt(appointment.patient.name),
          appointment.patient.paternalSurname
            ? this.encryption.decrypt(appointment.patient.paternalSurname)
            : null,
          appointment.patient.maternalSurname
            ? this.encryption.decrypt(appointment.patient.maternalSurname)
            : null,
        ]
          .filter(Boolean)
          .join(' '),
      });
    }
    return dto;
  }

  async findAllWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const data = await this.prisma.appointment.findMany({
      orderBy: { dateHour: 'asc' },
      where: {
        status: true,
        dateHour: {
          gte: monday,
          lte: sunday,
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
            message: true,
            phoneNumber: true,
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

    // Inicializar objeto con los días de la semana
    const weekSchedule: WeekScheduleDto = {
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
      const appointmentDay = appointment.dateHour.getDay();
      const dto = {
        Id: appointment.Id,
        dateHour: appointment.dateHour,
        minutesDuration: appointment.minutesDuration,
        notes: appointment.notes
          ? this.encryption.decrypt(appointment.notes)
          : null,
        treatment: appointment.treatment?.name ?? null,
        treatmentID: appointment.treatment?.Id ?? null,
        requestMessage: appointment.appointmentrequest?.message ?? null,
        requestPhoneNumber: appointment.appointmentrequest?.phoneNumber ?? null,
        patientID: appointment.patient.Id,
        patientPhoneNumber: appointment.patient.cellphoneNumber
          ? this.encryption.decrypt(appointment.patient.cellphoneNumber)
          : null,
        patient: [
          this.encryption.decrypt(appointment.patient.name),
          appointment.patient.paternalSurname
            ? this.encryption.decrypt(appointment.patient.paternalSurname)
            : null,
          appointment.patient.maternalSurname
            ? this.encryption.decrypt(appointment.patient.maternalSurname)
            : null,
        ]
          .filter(Boolean)
          .join(' '),
      };

      switch (appointmentDay) {
        case 1:
          weekSchedule.monday.push(dto);
          break;
        case 2:
          weekSchedule.tuesday.push(dto);
          break;
        case 3:
          weekSchedule.wednesday.push(dto);
          break;
        case 4:
          weekSchedule.thursday.push(dto);
          break;
        case 5:
          weekSchedule.friday.push(dto);
          break;
        case 6:
          weekSchedule.saturday.push(dto);
          break;
        case 0:
          weekSchedule.sunday.push(dto);
          break;
      }
    });

    return weekSchedule;
  }

  async findAllMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const start = new Date(year, month, 1, 0, 0, 0, 0);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const grouped = await this.prisma.appointment.groupBy({
      by: ['dateHour'],
      where: {
        status: true,
        dateHour: {
          gte: start,
          lte: end,
        },
      },
      _count: {
        dateHour: true,
      },
    });

    const result: { day: string; count: number }[] = [];
    const dayMap = new Map<string, number>();

    grouped.forEach((item) => {
      const dayStart = new Date(item.dateHour);
      dayStart.setHours(0, 0, 0, 0);
      const dayIso = dayStart.toISOString();
      dayMap.set(dayIso, (dayMap.get(dayIso) || 0) + item._count.dateHour);
    });

    dayMap.forEach((count, dayIso) => {
      result.push({ day: dayIso, count });
    });

    return result;
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
      patient: {
        Id: dbAppointment.patient.Id,
        name: this.encryption.decrypt(dbAppointment.patient.name),
        paternalSurname: dbAppointment.patient.paternalSurname
          ? this.encryption.decrypt(dbAppointment.patient.paternalSurname)
          : null,
        maternalSurname: dbAppointment.patient.maternalSurname
          ? this.encryption.decrypt(dbAppointment.patient.maternalSurname)
          : null,
        cellphoneNumber: dbAppointment.patient.cellphoneNumber
          ? this.encryption.decrypt(dbAppointment.patient.cellphoneNumber)
          : null,
      },
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
    const start = new Date(body.dateHour);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + body.minutesDuration);
    const overlaps = await this.prisma.appointment.findMany({
      where: {
        status: true,
        dateHour: { lt: end },
      },
      select: { Id: true, dateHour: true, minutesDuration: true },
    });

    const hasOverlap = overlaps.some((a) => {
      const aEnd = new Date(a.dateHour);
      aEnd.setMinutes(aEnd.getMinutes() + a.minutesDuration);
      return aEnd > start;
    });

    if (hasOverlap) {
      throw new HttpException('Appointment overlaps another one', 409);
    }

    return this.prisma.appointment.create({
      data: {
        ...body,
        AppUser_Id: userID,
        notes: body.notes ? this.encryption.encrypt(body.notes) : null,
      },
    });
  }

  async update(id: number, body: UpdateAppointmentDto, userID: number) {
    const start = new Date(body.dateHour);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + body.minutesDuration);

    const overlaps = await this.prisma.appointment.findMany({
      where: {
        status: true,
        Id: { not: id },
        dateHour: { lt: end },
      },
      select: { Id: true, dateHour: true, minutesDuration: true },
    });

    const hasOverlap = overlaps.some((a) => {
      const aEnd = new Date(a.dateHour);
      aEnd.setMinutes(aEnd.getMinutes() + a.minutesDuration);
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
        updateDate: new Date(),
        AppUser_Id: userID,
      },
    });
  }

  async softDelete(id: number, userID: number) {
    return this.prisma.appointment.update({
      where: { Id: id, status: true },
      data: {
        status: false,
        updateDate: new Date(),
        AppUser_Id: userID,
      },
    });
  }
}
