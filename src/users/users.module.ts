import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, EncryptionService],
})
export class UsersModule {}
