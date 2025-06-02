import { Module } from '@nestjs/common';
import { WorkDaysService } from './work-days.service';
import { WorkDaysController } from './work-days.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [WorkDaysController],
  providers: [WorkDaysService, PrismaService],
})
export class WorkDaysModule {}
