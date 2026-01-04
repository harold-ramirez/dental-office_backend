import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.shift.findMany({
      select: {
        Id: true,
        day: true,
        hour: true,
        status: true,
      },
    });
    const res: {
      Id: number;
      day: string;
      hour: string;
      status: boolean;
    }[] = [];

    data.map((shift) => {
      let dbHour = shift.hour.toISOString();
      dbHour = dbHour.split('T')[1];
      dbHour = dbHour.split('.')[0];
      dbHour = dbHour.slice(0, -3);
      res.push({ ...shift, hour: dbHour });
    });
    return res;
  }

  async create(createShiftDto: CreateShiftDto[]) {
    const res = await this.prisma.$transaction(
      createShiftDto.map((dto) => this.prisma.shift.create({ data: dto })),
    );

    return res;
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    return this.prisma.shift.update({
      where: { Id: id },
      data: {
        ...updateShiftDto,
        updateDate: new Date(),
      },
    });
  }
}
