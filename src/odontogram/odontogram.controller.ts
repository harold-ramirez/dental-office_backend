import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OdontogramService } from './odontogram.service';
import { CreateOdontogramDto } from './dto/create-odontogram.dto';
import { UpdateOdontogramDto } from './dto/update-odontogram.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('odontogram')
export class OdontogramController {
  constructor(private readonly odontogramService: OdontogramService) {}
  
  @Get(':patientId/teeth')
  getAllTeeth(@Param('patientId') patientId: string) {
    return this.odontogramService.getAllTeeth(+patientId);
  }
  
  @Get()
  findAll() {
    return this.odontogramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.odontogramService.findOne(+id);
  }

  @Post()
  create(@Body() createOdontogramDto: CreateOdontogramDto) {
    return this.odontogramService.create(createOdontogramDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOdontogramDto: UpdateOdontogramDto) {
    return this.odontogramService.update(+id, updateOdontogramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.odontogramService.remove(+id);
  }
}
