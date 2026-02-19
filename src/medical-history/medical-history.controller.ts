import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('medical-history')
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Get('/preview/:patientId')
  getPreview(@Param('patientId') id: string) {
    return this.medicalHistoryService.preview(+id);
  }

  @Get(':patientId')
  findAll(@Param('patientId') id: string) {
    return this.medicalHistoryService.findAll(+id);
  }

  @Post()
  create(@Body() body: CreateMedicalHistoryDto, @User() user: JwtUser) {
    return this.medicalHistoryService.create(body, user.userID);
  }
}
