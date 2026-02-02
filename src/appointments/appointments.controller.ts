import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('/summary')
  summary() {
    return this.appointmentsService.summary();
  }

  @Get('preview/:patientId')
  preview(@Param('patientId') patientId: number) {
    return this.appointmentsService.preview(+patientId);
  }

  @Get('history/:patientId')
  history(@Param('patientId') patientId: number) {
    return this.appointmentsService.history(+patientId);
  }

  @Get('/day/:date')
  findAllDay(@Param('date') date: string) {
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
  create(@Body() body: CreateAppointmentDto, @User() user: JwtUser) {
    return this.appointmentsService.create(body, user.userID);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @User() user: JwtUser,
  ) {
    return this.appointmentsService.update(
      +id,
      updateAppointmentDto,
      user.userID,
    );
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string, @User() user: JwtUser) {
    return this.appointmentsService.softDelete(+id, user.userID);
  }
}
