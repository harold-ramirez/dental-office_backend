import { HttpException, Injectable } from '@nestjs/common';
import { CreateDiagnosedProcedureDto } from './dto/create-diagnosed-procedure.dto';
import { UpdateDiagnosedProcedureDto } from './dto/update-diagnosed-procedure.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Injectable()
export class DiagnosedProcedureService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

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
    return await data.map((item) => ({
      Id: item.Id,
      description: item.description
        ? this.encryption.decrypt(item.description)
        : null,
      totalCost: item.totalCost,
      Treatment: {
        Id: item.treatment.Id,
        name: item.treatment.name,
        description: item.treatment.description,
      },
      totalPieces: item.diagnosedprocedure_tooth.length,
      registerDate: item.registerDate,
      updateDate: item.updateDate,
    }));
  }

  async findOne(id: number) {
    const data = await this.prisma.diagnosedprocedure.findUnique({
      where: { Id: id, status: true },
    });
    if (!data) throw new HttpException('Procedure not found', 404);
    return {
      ...data,
      description: data.description
        ? this.encryption.decrypt(data.description)
        : null,
    };
  }

  async create(body: CreateDiagnosedProcedureDto, userID: number) {
    return await this.prisma.$transaction(async (tx) => {
      const createdProcedure = await tx.diagnosedprocedure.create({
        data: {
          description: body.description
            ? this.encryption.encrypt(body.description)
            : null,
          totalCost: body.totalCost,
          Patient_Id: body.Patient_Id,
          Treatment_Id: body.Treatment_Id,
          AppUser_Id: userID,
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

  async update(id: number, body: UpdateDiagnosedProcedureDto, userID: number) {
    return await this.prisma.diagnosedprocedure.update({
      where: { Id: id, status: true },
      data: {
        ...body,
        description: body.description
          ? this.encryption.encrypt(body.description)
          : null,
        updateDate: new Date(),
        AppUser_Id: userID,
      },
    });
  }

  async remove(id: number, userID: number) {
    return await this.prisma.diagnosedprocedure.update({
      where: { Id: id, status: true },
      data: { status: false, updateDate: new Date(), AppUser_Id: userID },
    });
  }
}
