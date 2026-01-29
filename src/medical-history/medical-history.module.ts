import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService, EncryptionService],
})
export class MedicalHistoryModule {}
