import { Injectable } from '@nestjs/common';
import { CreateOdontogramDto } from './dto/create-odontogram.dto';
import { UpdateOdontogramDto } from './dto/update-odontogram.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OdontogramService {
  constructor(private prisma: PrismaService) {}

  // async getAllTeeth(patientId: number) {
  //   const form = await this.prisma.medicalhistoryform.findFirst({
  //     where: { Patient_Id: patientId, status: true },
  //     orderBy: { registerDate: 'desc' },
  //     select: { Id: true },
  //   });
  //   return await this.prisma.tooth.findMany({
  //     where: { Odontogram_Id: form?.Id },
  //     select: {
  //       Id: true,
  //       pieceNumber: true,
  //     },
  //   });
  // }

  create(createOdontogramDto: CreateOdontogramDto) {
    return 'This action adds a new odontogram';
  }

  findAll() {
    return `This action returns all odontogram`;
  }

  findOne(id: number) {
    return `This action returns a #${id} odontogram`;
  }

  update(id: number, updateOdontogramDto: UpdateOdontogramDto) {
    return `This action updates a #${id} odontogram`;
  }

  remove(id: number) {
    return `This action removes a #${id} odontogram`;
  }
}
