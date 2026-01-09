import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  
  @Get('/summary')
  summary() {
    return this.appointmentsService.summary();
  }
  
  @Get('/day/:date')
  findAllDay(@Param('date') date?: string) {
    return this.appointmentsService.findAllDay(date);
  }

  @Get('/week')
  findAllWeek() {
    return this.appointmentsService.findAllWeek();
  }

  @Get('/month')
  findAllMonth() {
    return this.appointmentsService.findAllMonth();
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
