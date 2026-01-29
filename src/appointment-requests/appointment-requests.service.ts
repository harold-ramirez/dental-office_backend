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
    return 'Landing Calendar';
  }

  async create(request: CreateAppointmentRequestDto) {
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

  async markAsRead(id: number, userID: number) {
    const updated = await this.prisma.appointmentrequest.update({
      where: { Id: id, status: true },
      data: {
        status: false,
        updateDate: new Date(),
        AppUser_Id: userID,
      },
    });
    // await this.appointmentsService.create(appointmentData);
    return updated;
  }

  // confirmar -> status=false && create appointment
  // reprogramar -> create appointment && status=false
  // rechazar -> status=false
}
