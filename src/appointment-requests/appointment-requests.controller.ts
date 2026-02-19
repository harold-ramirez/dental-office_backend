import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Query,
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
  findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
    return this.appointmentRequestsService.findAll(pageNum, pageSizeNum);
  }

  @UseGuards(JwtAuthGuard, UserThrottlerGuard)
  @Get('/pastRequests')
  findAllPast(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
    return this.appointmentRequestsService.findAllPast(pageNum, pageSizeNum);
  }

  @UseGuards(JwtAuthGuard, UserThrottlerGuard)
  @Delete('/:id')
  denyRequest(@Param('id') id: string, @User() user: JwtUser) {
    return this.appointmentRequestsService.denyRequest(+id, user.userID);
  }
}
