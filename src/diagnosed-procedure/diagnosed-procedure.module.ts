import { Module } from '@nestjs/common';
import { DiagnosedProcedureService } from './diagnosed-procedure.service';
import { DiagnosedProcedureController } from './diagnosed-procedure.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DiagnosedProcedureController],
  providers: [DiagnosedProcedureService, PrismaService],
})
export class DiagnosedProcedureModule {}
