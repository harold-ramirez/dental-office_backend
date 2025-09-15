import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';

@Controller('appointment-requests')
export class AppointmentRequestsController {
  constructor(private readonly appointmentRequestsService: AppointmentRequestsService) {}
  
  @Get('/')
  findAll() {
    return this.appointmentRequestsService.findAll();
  }
  
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.appointmentRequestsService.findOne(+id);
  }

  @Post()
  create(@Body() createAppointmentRequestDto: CreateAppointmentRequestDto) {
    return this.appointmentRequestsService.create(createAppointmentRequestDto);
  }

  @Patch('/:id')
  markAsRead(@Param('id') id: string, @Body() appointmentData: any) {
    return this.appointmentRequestsService.markAsRead(+id, 1, appointmentData); //Hardcoded userId
  }
}
