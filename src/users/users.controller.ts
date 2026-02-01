import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  findOne(@User() user: JwtUser) {
    return this.service.findOne(user.userID);
  }

  @Get('wa-message')
  getWhatsappMessage(@User() user: JwtUser) {
    return this.service.getWhatsappMessage(user.userID);
  }

  @Patch()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: JwtUser,
  ) {
    return this.service.update(updateUserDto, user.userID);
  }

  @Patch('/change-password')
  changePassword(
    @Body() passwords: { oldPassword: string; newPassword: string },
    @User() user: JwtUser,
  ) {
    return this.service.changePassword(passwords, user.userID);
  }
}
