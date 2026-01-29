import { Module } from '@nestjs/common';
import { DiagnosedProcedureService } from './diagnosed-procedure.service';
import { DiagnosedProcedureController } from './diagnosed-procedure.controller';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [DiagnosedProcedureController],
  providers: [DiagnosedProcedureService, EncryptionService],
})
export class DiagnosedProcedureModule {}
