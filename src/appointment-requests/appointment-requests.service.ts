import { Injectable } from '@nestjs/common';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { PrismaService } from 'src/prisma.service';
import { AppointmentsService } from 'src/appointments/appointments.service'; // importa el servicio

@Injectable()
export class AppointmentRequestsService {
  constructor(
    private prisma: PrismaService,
    private appointmentsService: AppointmentsService, // inyecta el servicio
  ) {}

  async findAll() {
    return this.prisma.appointmentrequest.findMany({
      where: { status: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.appointmentrequest.findUnique({
      where: { Id: id, status: true },
    });
  }

  async create(createAppointmentRequestDto: CreateAppointmentRequestDto) {
    return this.prisma.appointmentrequest.create({
      data: createAppointmentRequestDto,
    });
  }

  async markAsRead(id: number, userId: number, appointmentData: any) {
    // Actualiza el estado
    const updated = await this.prisma.appointmentrequest.update({
      where: { Id: id, status: true },
      data: { status: false, AppUser_Id: userId },
    });

    // Crea la cita (appointment)
    await this.appointmentsService.create(appointmentData);

    return updated;
  }
}
