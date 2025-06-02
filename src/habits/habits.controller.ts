import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

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
  create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(createHabitDto);
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
