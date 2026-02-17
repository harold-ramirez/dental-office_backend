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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('/')
  findAll() {
    return this.patientsService.findAll();
  }

  @Get('/names')
  findAllNames() {
    return this.patientsService.getPatientsNames();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Get('/search/:name')
  searchByName(@Param('name') name: string) {
    return this.patientsService.searchByName(name);
  }

  @Post()
  create(@Body() createPatientDto: CreatePatientDto, @User() user: JwtUser) {
    return this.patientsService.create(createPatientDto, user.userID);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @User() user: JwtUser,
  ) {
    return this.patientsService.update(+id, updatePatientDto, user.userID);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string, @User() user: JwtUser) {
    return this.patientsService.softDelete(+id, user.userID);
  }
}
