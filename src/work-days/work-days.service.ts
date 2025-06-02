import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WorkDaysService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.workday.findMany();
  }

  findOne(id: number) {
    return this.prisma.workday.findUnique({
      where: { Id: id },
  });
}
}
