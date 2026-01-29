import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PrismaService, EncryptionService],
})
export class PatientsModule {}
