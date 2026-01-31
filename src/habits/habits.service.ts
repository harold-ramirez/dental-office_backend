import { Injectable } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.habits.findMany({
      where: { status: true },
      orderBy: { name: 'asc' },
      select:{
        Id: true,
        name: true,
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.habits.findUnique({
      where: { Id: id, status: true },
    });
  }

  async create(createHabitDto: CreateHabitDto, userID: number) {
    return this.prisma.habits.create({
      data: {...createHabitDto, AppUser_Id: userID},
    });
  }

  async update(id: number, updateHabitDto: UpdateHabitDto) {
    return this.prisma.habits.update({
      where: { Id: id, status: true },
      data: {
        ...updateHabitDto,
        updateDate: new Date(),
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.habits.update({
      where: { Id: id, status: true },
      data: { status: false, updateDate: new Date() },
    });
  }
}
