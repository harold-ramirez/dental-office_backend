import { HttpException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(body: RegisterAuthDto) {
    const { password } = body;
    const hashedPassword = await hash(password, 10);
    body = {
      ...body,
      password: hashedPassword,
    };

    return await this.prisma.appuser.create({
      data: body,
    });
  }

  async login(body: LoginAuthDto) {
    const dbUser = await this.prisma.appuser.findFirst({
      where: {
        username: body.username,
      },
    });
    if (!dbUser) throw new HttpException('USER_NOT_FOUND', 404);
    const checkPassword = await compare(body.password, dbUser.password);
    if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);
    const token = await this.jwtService.signAsync(
      {
        sub: dbUser.Id,
        username: dbUser.username,
      },
      {
        expiresIn: `${dbUser.sessionDurationMinutes}m`,
      },
    );
    const data = {
      user: dbUser,
      token: token,
    };

    return data;
  }
}
