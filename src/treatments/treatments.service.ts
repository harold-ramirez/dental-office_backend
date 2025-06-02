import { Injectable } from '@nestjs/common';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TreatmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.treatment.findMany({
      where: { status: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.treatment.findUnique({
      where: { Id: id, status: true },
    });
  }

  async create(createTreatmentDto: CreateTreatmentDto) {
    return this.prisma.treatment.create({
      data: createTreatmentDto,
    });
  }

  async update(id: number, updateTreatmentDto: UpdateTreatmentDto) {
    return this.prisma.treatment.update({
      where: { Id: id, status: true },
      data: {
        ...updateTreatmentDto,
        updateDate: new Date(),
      }
    });
  }

  async softDelete(id: number) {
    return this.prisma.treatment.update({
      where: { Id: id, status: true },
      data: { status: false },
    });
  }
}
