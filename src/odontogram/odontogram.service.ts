import { Injectable } from '@nestjs/common';
import { UpdateOdontogramDto } from './dto/update-odontogram.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OdontogramService {
  constructor(private prisma: PrismaService) {}

  async preview(patientID: number) {
    return await this.prisma.odontogram.findMany({
      where: { status: true, medicalhistoryform: { Patient_Id: patientID } },
      orderBy: { registerDate: 'desc' },
      select: { registerDate: true },
    });
  }

  async findAll(patientID: number) {
    return await this.prisma.odontogram.findMany({
      orderBy: { registerDate: 'desc' },
      where: {
        status: true,
        medicalhistoryform: {
          Patient_Id: patientID,
          status: true,
        },
      },
      select: {
        Id: true,
        model: true,
        registerDate: true,
        updateDate: true,
        tooth: {
          select: {
            Id: true,
            pieceNumber: true,
            localStatus: true,
            toothsection: {
              select: {
                Id: true,
                name: true,
                localStatus: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateOdontogramDto: UpdateOdontogramDto) {
    return `This action updates a #${id} odontogram`;
  }
}
