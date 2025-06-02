import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('/')
  findAll() {
    return this.service.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.update(+id, updateUserDto);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(+id);
  }
}
