import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, EncryptionService],
})
export class PatientsModule {}
