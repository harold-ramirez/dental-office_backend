import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, EncryptionService],
})
export class AppointmentsModule {}
