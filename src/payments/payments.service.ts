import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async findAll(diagnosedProcedureId: number) {
    const procedure = await this.prisma.diagnosedprocedure.findUnique({
      where: { Id: diagnosedProcedureId, status: true },
      select: {
        description: true,
        totalCost: true,
        dentalPieces: true,
        treatment: {
          select: {
            name: true,
          },
        },
        registerDate: true,
      },
    });
    const payments = await this.prisma.payment.findMany({
      where: {
        DiagnosedProcedure_Id: diagnosedProcedureId,
        status: true,
      },
      orderBy: { registerDate: 'asc' },
      select: {
        Id: true,
        amount: true,
        registerDate: true,
      },
    });
    if (!procedure) return;

    const totalPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    const dto = {
      totalPaid: totalPaid,
      totalDue: (Number(procedure.totalCost) ?? 0) - totalPaid,
      description: procedure.description
        ? this.encryption.decrypt(procedure.description)
        : null,
      totalCost: Number(procedure.totalCost),
      treatment: procedure.treatment.name,
      registerDate: procedure.registerDate,
      dentalPieces: procedure.dentalPieces,
      payments,
    };
    return {
      ...dto,
    };
  }

  async findOne(Id: number) {
    return await this.prisma.payment.findUnique({
      where: { Id },
    });
  }

  async create(body: CreatePaymentDto, userID: number) {
    await this.prisma.$transaction(async (tx) => {
      await tx.payment.create({ data: { ...body, AppUser_Id: userID } });

      const { _sum } = await tx.payment.aggregate({
        where: {
          DiagnosedProcedure_Id: body.DiagnosedProcedure_Id,
          status: true,
        },
        _sum: { amount: true },
      });
      const procedure = await tx.diagnosedprocedure.findUnique({
        where: { Id: body.DiagnosedProcedure_Id, status: true },
        select: { totalCost: true },
      });
      if (Number(_sum.amount ?? 0) >= Number(procedure?.totalCost ?? 0)) {
        await tx.diagnosedprocedure.update({
          where: { Id: body.DiagnosedProcedure_Id, status: true },
          data: { updateDate: new Date() },
        });
      }
    });
  }

  async update(Id: number, updatePaymentDto: UpdatePaymentDto, userID: number) {
    return await this.prisma.payment.update({
      where: { Id },
      data: { ...updatePaymentDto, updateDate: new Date(), AppUser_Id: userID },
    });
  }

  async remove(Id: number) {
    return await this.prisma.payment.update({
      where: { Id, status: true },
      data: { status: false, updateDate: new Date() },
    });
  }
}
