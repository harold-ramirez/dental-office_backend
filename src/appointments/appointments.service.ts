import { Injectable } from '@nestjs/common';
import {
  CreateAppointmentDto,
  AppointmentHistoryDto,
} from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return await this.prisma.appointment.count({
      where: {
        status: true,
        dateHour: { gte: startOfDay, lte: endOfDay },
      },
    });
  }

  async preview(patientId: number) {
    const dbPreview = await this.prisma.appointment.findMany({
      take: 5,
      orderBy: { dateHour: 'desc' },
      where: { Patient_Id: patientId, status: true },
      select: {
        dateHour: true,
        diagnosedprocedure: {
          select: {
            treatment: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const preview: { dateHour: Date; treatment: string | null }[] =
      dbPreview.map((appointment) => {
        return {
          dateHour: appointment.dateHour,
          treatment: appointment.diagnosedprocedure?.treatment.name ?? null,
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
      requestMessage: appointment.appointmentrequest?.message ?? null,
      treatment: appointment.diagnosedprocedure?.treatment.name ?? null,
    });

    const appointmentSelect = {
      dateHour: true,
      minutesDuration: true,
      appointmentrequest: {
        select: {
          message: true,
        },
      },
      diagnosedprocedure: {
        select: {
          treatment: {
            select: {
              name: true,
            },
          },
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

  async findAllDay(date?: string) {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }
    const start = new Date(date + 'T00:00:00');
    const end = new Date(date + 'T23:59:59.999');

    return this.prisma.appointment.findMany({
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
        DiagnosedProcedure_Id: true,
        patient: {
          select: {
            Id: true,
            name: true,
            paternalSurname: true,
            maternalSurname: true,
          },
        },
        minutesDuration: true,
      },
    });
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

    return this.prisma.appointment.findMany({
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
        patient: {
          select: {
            Id: true,
            name: true,
            paternalSurname: true,
            maternalSurname: true,
          },
        },
        minutesDuration: true,
      },
    });
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

    // Agrupa por día (ignorando la hora)
    const result: { day: string; count: number }[] = [];
    const dayMap = new Map<string, number>();

    grouped.forEach((item) => {
      const day = item.dateHour.toISOString().split('T')[0];
      dayMap.set(day, (dayMap.get(day) || 0) + item._count.dateHour);
    });

    dayMap.forEach((count, day) => {
      result.push({ day, count });
    });

    return result;
  }

  async findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { Id: id, status: true },
      select: {
        Id: true,
        dateHour: true,
        diagnosedprocedure: {
          select: {
            Id: true,
            description: true,
            treatment: {
              select: {
                Id: true,
                name: true,
              },
            },
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
        minutesDuration: true,
        appuser: {
          select: {
            Id: true,
            username: true,
          },
        },
        registerDate: true,
        updateDate: true,
      },
    });
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: createAppointmentDto,
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { Id: id, status: true },
      data: {
        ...updateAppointmentDto,
        updateDate: new Date(),
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.appointment.update({
      where: { Id: id, status: true },
      data: { status: false, updateDate: new Date() },
    });
  }
}
