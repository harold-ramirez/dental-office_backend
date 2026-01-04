import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';

@Controller('appointment-requests')
export class AppointmentRequestsController {
  constructor(
    private readonly appointmentRequestsService: AppointmentRequestsService,
  ) {}

  @Get('/')
  findAll() {
    return this.appointmentRequestsService.findAll();
  }

  @Get('/pastRequests')
  findAllPast() {
    return this.appointmentRequestsService.findAllPast();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.appointmentRequestsService.findOne(+id);
  }

  @Post('/')
  create(@Body() createAppointmentRequestDto: CreateAppointmentRequestDto) {
    return this.appointmentRequestsService.create(createAppointmentRequestDto);
  }

  @Patch('/:id/:userId')
  markAsRead(@Param('id') id: string, @Param('userId') userId: string) {
    return this.appointmentRequestsService.markAsRead(+id, +userId);
  }
}
