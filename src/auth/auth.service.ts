import { HttpException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from 'src/utils/encryption.service';
import { JwtUser } from 'src/auth/user.decorator';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private encryption: EncryptionService,
  ) {}

  async register(body: RegisterAuthDto) {
    const userCount = await this.prisma.appuser.count({
      where: { status: true },
    });
    if (userCount >= 2)
      throw new HttpException('REGISTRATION_LIMIT_REACHED', 403);

    const { password } = body;
    const hashedPassword = await hash(password, 10);
    body = {
      ...body,
      name: this.encryption.encrypt(body.name),
      paternalSurname: body.paternalSurname
        ? this.encryption.encrypt(body.paternalSurname)
        : null,
      maternalSurname: body.maternalSurname
        ? this.encryption.encrypt(body.maternalSurname)
        : null,
      phoneNumber: this.encryption.encrypt(body.phoneNumber),
      password: hashedPassword,
    };

    return await this.prisma.appuser.create({
      data: body,
    });
  }

  async login(body: LoginAuthDto) {
    const dbUser = await this.prisma.appuser.findFirst({
      where: { username: body.username },
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
      token: token,
    };

    return data;
  }

  async me(user: JwtUser) {
    return await this.prisma.appuser.findUnique({
      where: { Id: user.userID, status: true },
      select: { Id: true, username: true },
    });
  }
}
