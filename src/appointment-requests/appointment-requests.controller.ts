import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('appointment-requests')
export class AppointmentRequestsController {
  constructor(
    private readonly appointmentRequestsService: AppointmentRequestsService,
  ) {}
  // Landing Page
  @Post('/')
  create(@Body() createAppointmentRequestDto: CreateAppointmentRequestDto) {
    return this.appointmentRequestsService.create(createAppointmentRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  findAll() {
    return this.appointmentRequestsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/pastRequests')
  findAllPast() {
    return this.appointmentRequestsService.findAllPast();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.appointmentRequestsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/:userId')
  markAsRead(@Param('id') id: string, @Param('userId') userId: string) {
    return this.appointmentRequestsService.markAsRead(+id, +userId);
  }
}
