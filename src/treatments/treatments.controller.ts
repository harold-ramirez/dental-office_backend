import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';

@Controller('/treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Get('/')
  findAll() {
    return this.treatmentsService.findAll();
  }
  
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.treatmentsService.findOne(+id);
  }

  @Post()
  create(@Body() createTreatmentDto: CreateTreatmentDto) {
    return this.treatmentsService.create(createTreatmentDto);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateTreatmentDto: UpdateTreatmentDto) {
    return this.treatmentsService.update(+id, updateTreatmentDto);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.treatmentsService.softDelete(+id);
  }
}
