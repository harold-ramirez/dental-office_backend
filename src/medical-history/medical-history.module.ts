import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService, PrismaService],
})
export class MedicalHistoryModule {}
