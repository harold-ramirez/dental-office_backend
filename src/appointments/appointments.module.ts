import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, PrismaService, EncryptionService],
})
export class AppointmentsModule {}
