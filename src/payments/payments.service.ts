import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(diagnosedProcedureId: number) {
    return await this.prisma.payment.findMany({
      where: {
        DiagnosedProcedure_Id: diagnosedProcedureId,
        status: true,
      },
    });
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
