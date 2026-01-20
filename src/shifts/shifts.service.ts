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

    const groupedByDay = {
      Monday: [] as { Id: number; hour: string; status: boolean }[],
      Tuesday: [] as { Id: number; hour: string; status: boolean }[],
      Wednesday: [] as { Id: number; hour: string; status: boolean }[],
      Thursday: [] as { Id: number; hour: string; status: boolean }[],
      Friday: [] as { Id: number; hour: string; status: boolean }[],
      Saturday: [] as { Id: number; hour: string; status: boolean }[],
      Sunday: [] as { Id: number; hour: string; status: boolean }[],
    };

    data.forEach((shift) => {
      let dbHour = shift.hour.toISOString();
      dbHour = dbHour.split('T')[1];
      dbHour = dbHour.split('.')[0];
      dbHour = dbHour.slice(0, -3);

      const shiftData = { Id: shift.Id, hour: dbHour, status: shift.status };
      groupedByDay[shift.day]?.push(shiftData);
    });

    return groupedByDay;
  }

  async create(createShiftDto: CreateShiftDto[]) {
    const res = await this.prisma.$transaction(
      createShiftDto.map((dto) => this.prisma.shift.create({ data: dto })),
    );

    return res;
  }

  async update(body: UpdateShiftDto[]) {
    const res = await this.prisma.$transaction(
      body.map((dto) =>
        this.prisma.shift.update({
          where: { Id: dto.Id },
          data: {
            status: dto.status,
            AppUser_Id: dto.AppUser_Id,
            updateDate: new Date(),
          },
        }),
      ),
    );
    return res;
  }
}
