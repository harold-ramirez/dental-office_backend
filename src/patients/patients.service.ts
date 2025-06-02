import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.patient.findMany({
      where: { status: true },
    });
  }
  
  async findOne(id: number) {
    return this.prisma.patient.findUnique({
      where: { Id: id, status: true },
    });
  }

  async create(createPatientDto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: createPatientDto,
    });
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    return this.prisma.patient.update({
      where: { Id: id, status: true },
      data: {
        ...updatePatientDto,
        updateDate: new Date(),
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.patient.update({
      where: { Id: id, status: true },
      data: { status: false },
    });
  }
}
