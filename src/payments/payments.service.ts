import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(diagnosedProcedureId: number) {
    const procedure = await this.prisma.diagnosedprocedure.findUnique({
      where: { Id: diagnosedProcedureId, status: true },
      select: {
        description: true,
        totalCost: true,
        treatment: {
          select: {
            name: true,
          },
        },
        registerDate: true,
        diagnosedprocedure_tooth: {
          select: {
            tooth: {
              select: {
                pieceNumber: true,
              },
            },
          },
        },
      },
    });
    const payments = await this.prisma.payment.findMany({
      where: {
        DiagnosedProcedure_Id: diagnosedProcedureId,
        status: true,
      },
      orderBy: { registerDate: 'asc' },
      select:{
        Id: true,
        amount: true,
        registerDate: true,
      }
    });
    if (!procedure) return;

    const totalPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    const dto = {
      totalPaid: totalPaid,
      totalDue: (Number(procedure.totalCost) ?? 0) - totalPaid,
      description: procedure.description,
      totalCost: Number(procedure.totalCost),
      treatment: procedure.treatment.name,
      registerDate: procedure.registerDate,
      totalPieces: procedure.diagnosedprocedure_tooth.map(
        (item) => item.tooth.pieceNumber,
      ),
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

  async create(createPaymentDto: CreatePaymentDto) {
    return await this.prisma.payment.create({
      data: createPaymentDto,
    });
  }

  async update(Id: number, updatePaymentDto: UpdatePaymentDto) {
    return await this.prisma.payment.update({
      where: { Id },
      data: { ...updatePaymentDto, updateDate: new Date() },
    });
  }

  async remove(Id: number) {
    return await this.prisma.payment.update({
      where: { Id, status: true },
      data: { status: false, updateDate: new Date() },
    });
  }
}
