import { HttpException, Injectable } from '@nestjs/common';
import { CreateDiagnosedProcedureDto } from './dto/create-diagnosed-procedure.dto';
import { UpdateDiagnosedProcedureDto } from './dto/update-diagnosed-procedure.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';
import { utcNow } from 'src/utils/utc-date';

@Injectable()
export class DiagnosedProcedureService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async pendingPayments() {
    const procedures = await this.prisma.diagnosedprocedure.findMany({
      where: { status: true },
      select: {
        Id: true,
        totalCost: true,
        patient: {
          select: {
            name: true,
            paternalSurname: true,
            maternalSurname: true,
          },
        },
        treatment: {
          select: {
            name: true,
          },
        },
        payment: {
          where: { status: true },
          select: {
            amount: true,
          },
        },
      },
    });

    const pendingPayments = procedures
      .map((procedure) => {
        const totalPaid = procedure.payment.reduce(
          (sum, payment) => sum + Number(payment.amount),
          0,
        );
        const totalCost = Number(procedure.totalCost || 0);
        const pendingAmount = totalCost - totalPaid;

        if (pendingAmount > 0) {
          const patientName = [
            this.encryption.decrypt(procedure.patient.name),
            procedure.patient.paternalSurname
              ? this.encryption.decrypt(procedure.patient.paternalSurname)
              : null,
            procedure.patient.maternalSurname
              ? this.encryption.decrypt(procedure.patient.maternalSurname)
              : null,
          ]
            .filter(Boolean)
            .join(' ');

          return {
            patientName,
            treatment: procedure.treatment.name,
            pendingAmount,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    return pendingPayments;
  }

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
        dentalPieces: true,
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
      dentalPieces: item.dentalPieces?.split('-').length ?? 0,
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
    return await this.prisma.diagnosedprocedure.create({
      data: {
        description: body.description
          ? this.encryption.encrypt(body.description)
          : null,
        dentalPieces: body.dentalPieces,
        totalCost: body.totalCost,
        Patient_Id: body.Patient_Id,
        Treatment_Id: body.Treatment_Id,
        AppUser_Id: userID,
      },
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
        updateDate: utcNow(),
        AppUser_Id: userID,
      },
    });
  }

  async remove(id: number, userID: number) {
    return await this.prisma.diagnosedprocedure.update({
      where: { Id: id, status: true },
      data: { status: false, updateDate: utcNow(), AppUser_Id: userID },
    });
  }
}
