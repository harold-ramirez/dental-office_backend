import { Module } from '@nestjs/common';
import { PersonalPathologiesService } from './personal-pathologies.service';
import { PersonalPathologiesController } from './personal-pathologies.controller';

@Module({
  controllers: [PersonalPathologiesController],
  providers: [PersonalPathologiesService],
})
export class PersonalPathologiesModule {}
