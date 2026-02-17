import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get('/')
  findAll() {
    return this.habitsService.findAll();
  }
  
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.habitsService.findOne(+id);
  }

  @Post()
  create(@Body() createHabitDto: CreateHabitDto, @User() user: JwtUser) {
    return this.habitsService.create(createHabitDto, user.userID);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitsService.update(+id, updateHabitDto);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.habitsService.softDelete(+id);
  }
}
