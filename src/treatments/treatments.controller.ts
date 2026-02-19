import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('/treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Get('/')
  findAll() {
    return this.treatmentsService.findAll();
  }
  
  // @Get('/:id')
  // findOne(@Param('id') id: string) {
  //   return this.treatmentsService.findOne(+id);
  // }

  @Post()
  create(@Body() createTreatmentDto: CreateTreatmentDto, @User() user: JwtUser) {
    return this.treatmentsService.create(createTreatmentDto, user.userID);
  }

  // @Patch('/:id')
  // update(@Param('id') id: string, @Body() updateTreatmentDto: UpdateTreatmentDto) {
  //   return this.treatmentsService.update(+id, updateTreatmentDto);
  // }

  // @Delete('/:id')
  // softDelete(@Param('id') id: string) {
  //   return this.treatmentsService.softDelete(+id);
  // }
}
