import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.shift.findMany({
      where: { status: true },
    });
  }
  
  async findOne(id: number) {
    return this.prisma.shift.findUnique({
      where: { Id: id, status: true },
    });
  }

  async create(createShiftDto: CreateShiftDto) {
    return this.prisma.shift.create({
      data: createShiftDto,
    });
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    return this.prisma.shift.update({
      where: { Id: id, status: true },
      data: {
        ...updateShiftDto,
        updateDate: new Date(),
      }
    });
  }

  async softDelete(id: number) {
    return this.prisma.shift.update({
      where: { Id: id, status: true },
      data: { status: false },
    });
  }
}
