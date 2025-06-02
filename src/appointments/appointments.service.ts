import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.appointment.findMany({
      where: { status: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { Id: id, status: true },
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
      data: { status: false },
    });
  }
}
