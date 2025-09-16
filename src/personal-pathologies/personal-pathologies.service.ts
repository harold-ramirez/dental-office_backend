import { Injectable } from '@nestjs/common';
import { CreatePersonalPathologyDto } from './dto/create-personal-pathology.dto';
import { UpdatePersonalPathologyDto } from './dto/update-personal-pathology.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PersonalPathologiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.personalpathologicalhistory.findMany({
      where: { status: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.personalpathologicalhistory.findUnique({
      where: { Id: id, status: true },
    });
  }

  async create(createPersonalPathologyDto: CreatePersonalPathologyDto) {
    return this.prisma.personalpathologicalhistory.create({
      data: createPersonalPathologyDto,
    });
  }

  async update(
    id: number,
    updatePersonalPathologyDto: UpdatePersonalPathologyDto,
  ) {
    return this.prisma.personalpathologicalhistory.update({
      where: { Id: id, status: true },
      data: {
        ...updatePersonalPathologyDto,
        updateDate: new Date(),
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.personalpathologicalhistory.update({
      where: { Id: id, status: true },
      data: { status: false, updateDate: new Date() },
    });
  }
}
