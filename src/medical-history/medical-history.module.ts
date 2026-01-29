import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService, PrismaService, EncryptionService],
})
export class MedicalHistoryModule {}
