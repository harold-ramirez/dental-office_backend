import { Module } from '@nestjs/common';
import { PersonalPathologiesService } from './personal-pathologies.service';
import { PersonalPathologiesController } from './personal-pathologies.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PersonalPathologiesController],
  providers: [PersonalPathologiesService, PrismaService],
})
export class PersonalPathologiesModule {}
