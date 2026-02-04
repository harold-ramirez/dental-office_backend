import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';

@Controller('appointment-requests')
export class AppointmentRequestsController {
  constructor(
    private readonly appointmentRequestsService: AppointmentRequestsService,
  ) {}

  // Landing Page (no Auth)
  @Get('/calendar')
  getLandingCalendar() {
    return this.appointmentRequestsService.getLandingCalendar();
  }

  // Landing Page (no Auth)
  @Get('/doctor-phoneNumber')
  getWaNumber() {
    return this.appointmentRequestsService.getWaNumber();
  }

  // Landing Page (no Auth)
  @Post()
  sendRequest(@Body() createAppointmentRequestDto: CreateAppointmentRequestDto) {
    return this.appointmentRequestsService.sendRequest(createAppointmentRequestDto);
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
  @Delete('/:id')
  denyRequest(@Param('id') id: string, @User() user: JwtUser) {
    return this.appointmentRequestsService.denyRequest(+id, user.userID);
  }
}
