import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createAuthDto: RegisterAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validate(@User() user: JwtUser) {
    return this.authService.validate(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm-password')
  confirmPassword(
    @Body() password: { password: string },
    @User() user: JwtUser,
  ) {
    return this.authService.confirmPassword(password.password, user.userID);
  }
}
