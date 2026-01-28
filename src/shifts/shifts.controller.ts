import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get('/')
  findAll() {
    return this.shiftsService.findAll();
  }

  @Post()
  create(@Body() shift: CreateShiftDto[]) {
    return this.shiftsService.create(shift);
  }

  @Patch()
  update(@Body() body: UpdateShiftDto[]) {
    return this.shiftsService.update(body);
  }
}
