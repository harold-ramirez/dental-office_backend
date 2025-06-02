import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(+id);
  }

  @Post()
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.create(createShiftDto);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftsService.update(+id, updateShiftDto);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.shiftsService.softDelete(+id);
  }
}
