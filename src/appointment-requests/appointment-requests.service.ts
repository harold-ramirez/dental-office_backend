import { Injectable } from '@nestjs/common';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { PrismaService } from 'src/prisma.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Injectable()
export class AppointmentRequestsService {
  constructor(
    private prisma: PrismaService,
    private appointmentsService: AppointmentsService,
  ) {}

  async findAll() {
    return this.prisma.appointmentrequest.findMany({
      where: { status: true },
      orderBy: { registerDate: 'asc' },
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
  }

  async findAllPast() {
    return this.prisma.appointmentrequest.findMany({
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
  }

  async findOne(id: number) {
    return this.prisma.appointmentrequest.findUnique({
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
  }

  async markAsRead(id: number, userId: number) {
    const updated = await this.prisma.appointmentrequest.update({
      where: { Id: id, status: true },
      data: {
        status: false,
        updateDate: new Date(),
        AppUser_Id: userId,
      },
    });
    // await this.appointmentsService.create(appointmentData);
    return updated;
  }

  // confirmar -> status=false && create appointment
  // reprogramar -> create appointment && status=false
  // rechazar -> status=false
}
