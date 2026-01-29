import { Module } from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { AppointmentRequestsController } from './appointment-requests.controller';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [AppointmentRequestsController],
  providers: [
    AppointmentRequestsService,
    AppointmentsService,
    EncryptionService,
  ],
})
export class AppointmentRequestsModule {}
