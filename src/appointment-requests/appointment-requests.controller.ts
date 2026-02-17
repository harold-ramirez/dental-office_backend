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
import { Throttle } from '@nestjs/throttler';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@Controller('appointment-requests')
export class AppointmentRequestsController {
  constructor(
    private readonly appointmentRequestsService: AppointmentRequestsService,
  ) {}

  // Landing Page (no Auth)
  @Throttle({ default: { ttl: 60, limit: 30 } })
  @Get('/calendar')
  getLandingCalendar() {
    return this.appointmentRequestsService.getLandingCalendar();
  }

  // Landing Page (no Auth)
  @Throttle({ default: { ttl: 60, limit: 30 } })
  @Get('/doctor-phoneNumber')
  getWaNumber() {
    return this.appointmentRequestsService.getWaNumber();
  }

  // Landing Page (no Auth)
  @Throttle({ default: { ttl: 60, limit: 10 } })
  @Post()
  sendRequest(@Body() body: CreateAppointmentRequestDto) {
    return this.appointmentRequestsService.sendRequest(body);
  }

  @UseGuards(JwtAuthGuard, UserThrottlerGuard)
  @Get('/')
  findAll() {
    return this.appointmentRequestsService.findAll();
  }

  @UseGuards(JwtAuthGuard, UserThrottlerGuard)
  @Get('/pastRequests')
  findAllPast() {
    return this.appointmentRequestsService.findAllPast();
  }

  @UseGuards(JwtAuthGuard, UserThrottlerGuard)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.appointmentRequestsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, UserThrottlerGuard)
  @Delete('/:id')
  denyRequest(@Param('id') id: string, @User() user: JwtUser) {
    return this.appointmentRequestsService.denyRequest(+id, user.userID);
  }
}
