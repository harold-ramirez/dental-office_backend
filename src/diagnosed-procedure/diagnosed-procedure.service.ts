import { Injectable } from '@nestjs/common';
import { CreateDiagnosedProcedureDto } from './dto/create-diagnosed-procedure.dto';
import { UpdateDiagnosedProcedureDto } from './dto/update-diagnosed-procedure.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DiagnosedProcedureService {
  constructor(private prisma: PrismaService) {}

  async preview(patientId: number) {
    return await this.prisma.diagnosedprocedure.findMany({
      take: 5,
      orderBy: { registerDate: 'desc' },
      where: { Patient_Id: patientId, status: true },
      select: {
        Id: true,
        registerDate: true,
        treatment: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAll(patientId: number) {
    const data = await this.prisma.diagnosedprocedure.findMany({
      orderBy: { registerDate: 'desc' },
      where: {
        Patient_Id: patientId,
        status: true,
      },
      select: {
        Id: true,
        description: true,
        totalCost: true,
        treatment: {
          select: {
            Id: true,
            name: true,
            description: true,
          },
        },
        registerDate: true,
        updateDate: true,
        diagnosedprocedure_tooth: {
          select: {
            tooth: {
              select: {
                Id: true,
                pieceNumber: true,
              },
            },
          },
        },
      },
    });
    const diagnosedProcedureDto: any[] = [];
    data.map((item) => {
      diagnosedProcedureDto.push({
        Id: item.Id,
        description: item.description,
        totalCost: item.totalCost,
        Treatment: {
          Id: item.treatment.Id,
          name: item.treatment.name,
          description: item.treatment.description,
        },
        totalPieces: item.diagnosedprocedure_tooth.length,
        registerDate: item.registerDate,
        updateDate: item.updateDate,
      });
    });
    return diagnosedProcedureDto;
  }

  async findOne(id: number) {
    return await this.prisma.diagnosedprocedure.findUnique({
      where: { Id: id, status: true },
    });
  }

  async create(body: CreateDiagnosedProcedureDto) {
    return await this.prisma.$transaction(async (tx) => {
      const createdProcedure = await tx.diagnosedprocedure.create({
        data: {
          description: body.description,
          totalCost: body.totalCost,
          Patient_Id: body.Patient_Id,
          Treatment_Id: body.Treatment_Id,
          AppUser_Id: body.AppUser_Id,
        },
      });

      const uniqueToothIds = Array.from(new Set(body.dentalPieces ?? []));
      const links = await Promise.all(
        uniqueToothIds.map((toothId) =>
          tx.diagnosedprocedure_tooth.create({
            data: {
              DiagnosedProcedure_Id: createdProcedure.Id,
              Tooth_Id: toothId,
            },
          }),
        ),
      );

      return {
        ...createdProcedure,
        totalPieces: links.length,
      };
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
