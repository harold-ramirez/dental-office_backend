import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('/')
  findAll() {
    return this.patientsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Get('/search/:name')
  searchByName(@Param('name') name: string) {
    return this.patientsService.searchByName(name);
  }

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.patientsService.softDelete(+id);
  }
}
