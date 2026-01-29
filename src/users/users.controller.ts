import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: JwtUser,
  ) {
    return this.service.update(+id, updateUserDto, user.userID);
  }

  @Patch('/change-password')
  changePassword(
    @Body() passwords: { oldPassword: string; newPassword: string },
    @User() user: JwtUser,
  ) {
    return this.service.changePassword(passwords, user.userID);
  }
}
