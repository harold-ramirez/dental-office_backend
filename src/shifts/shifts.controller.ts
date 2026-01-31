import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('/shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get('/')
  findAll() {
    return this.shiftsService.findAll();
  }

  @Post()
  create(@Body() shift: CreateShiftDto[], @User() user: JwtUser) {
    return this.shiftsService.create(shift, user.userID);
  }

  @Patch()
  update(@Body() body: UpdateShiftDto[], @User() user: JwtUser) {
    return this.shiftsService.update(body, user.userID);
  }
}
