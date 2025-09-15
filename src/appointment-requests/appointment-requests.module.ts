import { Module } from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { AppointmentRequestsController } from './appointment-requests.controller';
import { PrismaService } from 'src/prisma.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Module({
  controllers: [AppointmentRequestsController],
  providers: [AppointmentRequestsService, PrismaService, AppointmentsService],
})
export class AppointmentRequestsModule {}
