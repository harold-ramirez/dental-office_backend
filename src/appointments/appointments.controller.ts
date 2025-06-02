import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  
  @Get('/')
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.appointmentsService.softDelete(+id);
  }
}
