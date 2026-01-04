import { Injectable } from '@nestjs/common';
import { CreateDiagnosedProcedureDto } from './dto/create-diagnosed-procedure.dto';
import { UpdateDiagnosedProcedureDto } from './dto/update-diagnosed-procedure.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DiagnosedProcedureService {
  constructor(private prisma: PrismaService) {}

  async findAll(patientId: number) {
    return await this.prisma.diagnosedprocedure.findMany({
      where: {
        Patient_Id: patientId,
        status: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.diagnosedprocedure.findUnique({
      where: { Id: id, status: true },
    });
  }

  async create(createDiagnosedProcedureDto: CreateDiagnosedProcedureDto) {
    return await this.prisma.diagnosedprocedure.create({
      data: createDiagnosedProcedureDto,
    });
  }

  async update(
    id: number,
    updateDiagnosedProcedureDto: UpdateDiagnosedProcedureDto,
  ) {
    return await this.prisma.diagnosedprocedure.update({
      where: { Id: id, status: true },
      data: { ...updateDiagnosedProcedureDto, updateDate: new Date() },
    });
  }

  async remove(id: number) {
    return await this.prisma.diagnosedprocedure.update({
      where: { Id: id, status: true },
      data: { status: false, updateDate: new Date() },
    });
  }
}
