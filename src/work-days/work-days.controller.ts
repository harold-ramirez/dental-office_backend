import { Controller, Get, Param } from '@nestjs/common';
import { WorkDaysService } from './work-days.service';

@Controller('/work-days')
export class WorkDaysController {
  constructor(private readonly workDaysService: WorkDaysService) {}

  @Get('/')
  findAll() {
    return this.workDaysService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.workDaysService.findOne(+id);
  }
}
