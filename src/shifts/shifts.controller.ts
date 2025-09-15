import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Controller('/shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get('/')
  findAll() {
    return this.shiftsService.findAll();
  }

  @Post()
  create(@Body() shift: CreateShiftDto) {
    return this.shiftsService.create(shift);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() shift: UpdateShiftDto) {
    return this.shiftsService.update(+id, shift);
  }
}
