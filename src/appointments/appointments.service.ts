import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

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
        diagnosedprocedure:{
          select:{
            Id: true,
            description: true,
            treatment:{
              select:{
                Id: true,
                name: true,
              }
            }
          }
        },
        appointmentrequest:{
          select:{
            Id: true,
            dateHourRequest: true,
            message: true,
            registerDate: true,
            status: true,
          }
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
        appuser:{
          select:{
            Id: true,
            username: true,
          }
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
