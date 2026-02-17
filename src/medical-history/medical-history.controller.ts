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
import { MedicalHistoryService } from './medical-history.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
// import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto, @User() user: JwtUser) {
  //   return this.medicalHistoryService.update(+id, updateMedicalHistoryDto);
  // }

  @Delete('/:id')
  softDelete(@Param('id') id: string, @User() user: JwtUser) {
    return this.medicalHistoryService.softDelete(+id, user.userID);
  }
}
