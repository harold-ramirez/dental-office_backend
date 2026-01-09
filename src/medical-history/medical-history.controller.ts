import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
// import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

@Controller('medical-history')
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Get('/preview/:patientId')
  getPreview(@Param('patientId') id: string) {
    return this.medicalHistoryService.preview(+id);
  }
  
  @Get(':patientId')
  findAll(@Param('patientId') id: string) {
    return this.medicalHistoryService.findAll(+id);
  }

  @Post()
  create(@Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
    return this.medicalHistoryService.create(createMedicalHistoryDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
  //   return this.medicalHistoryService.update(+id, updateMedicalHistoryDto);
  // }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.medicalHistoryService.softDelete(+id);
  }
}
