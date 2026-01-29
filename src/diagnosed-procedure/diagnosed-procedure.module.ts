import { Module } from '@nestjs/common';
import { DiagnosedProcedureService } from './diagnosed-procedure.service';
import { DiagnosedProcedureController } from './diagnosed-procedure.controller';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [DiagnosedProcedureController],
  providers: [DiagnosedProcedureService, PrismaService, EncryptionService],
})
export class DiagnosedProcedureModule {}
