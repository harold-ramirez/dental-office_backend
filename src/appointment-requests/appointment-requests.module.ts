import { Module } from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { AppointmentRequestsController } from './appointment-requests.controller';
import { EncryptionService } from 'src/utils/encryption.service';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@Module({
  controllers: [AppointmentRequestsController],
  providers: [
    AppointmentRequestsService,
    EncryptionService,
    UserThrottlerGuard,
  ],
})
export class AppointmentRequestsModule {}
