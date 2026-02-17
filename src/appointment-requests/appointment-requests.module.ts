import { Module } from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { AppointmentRequestsController } from './appointment-requests.controller';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { EncryptionService } from 'src/utils/encryption.service';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@Module({
  controllers: [AppointmentRequestsController],
  providers: [
    AppointmentRequestsService,
    AppointmentsService,
    EncryptionService,
    UserThrottlerGuard,
  ],
})
export class AppointmentRequestsModule {}
