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
      orderBy: { registerDate: 'desc' },
      select: {
        Id: true,
        name: true,
        paternalSurname: true,
        maternalSurname: true,
        gender: true,
        cellphoneNumber: true,
        telephoneNumber: true,
        birthdate: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.patient.findUnique({
      where: { Id: id, status: true },
      select: {
        Id: true,
        name: true,
        paternalSurname: true,
        maternalSurname: true,
        gender: true,
        cellphoneNumber: true,
        telephoneNumber: true,
        placeOfBirth: true,
        birthdate: true,
        occupation: true,
        address: true,
        complementaryimage: {
          select: {
            Id: true,
            fileName: true,
            filePath: true,
            captureDate: true,
            description: true,
          },
        },
        registerDate: true,
        updateDate: true,
        appuser: {
          select: {
            Id: true,
            username: true,
          },
        },
      },
    });
  }

  async searchByName(name: string) {
    const words = name.trim().split(/\s+/);
    return this.prisma.patient.findMany({
      where: {
        status: true,
        AND: words.map((word) => ({
          OR: [
            { name: { contains: word } },
            { paternalSurname: { contains: word } },
            { maternalSurname: { contains: word } },
          ],
        })),
      },
      select: {
        Id: true,
        name: true,
        paternalSurname: true,
        maternalSurname: true,
      },
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
      data: { status: false, updateDate: new Date() },
    });
  }
}
