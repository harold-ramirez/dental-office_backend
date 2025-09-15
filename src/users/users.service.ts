import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.appuser.findUnique({
      where: { Id: id, status: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.appuser.update({
      where: { Id: id, status: true },
      data: {
        ...updateUserDto,
        updateDate: new Date(),
      },
    })
  }
}
