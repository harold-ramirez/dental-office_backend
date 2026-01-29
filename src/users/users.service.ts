import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { EncryptionService } from 'src/utils/encryption.service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async findOne(id: number) {
    const dbUser = await this.prisma.appuser.findUnique({
      where: { Id: id, status: true },
    });
    if (!dbUser) throw new HttpException('User not found', 404);
    return {
      ...dbUser,
      name: dbUser.name ? this.encryption.decrypt(dbUser.name) : null,
      paternalSurname: dbUser.paternalSurname
        ? this.encryption.decrypt(dbUser.paternalSurname)
        : null,
      maternalSurname: dbUser.maternalSurname
        ? this.encryption.decrypt(dbUser.maternalSurname)
        : null,
      phoneNumber: dbUser.phoneNumber
        ? this.encryption.decrypt(dbUser.phoneNumber)
        : null,
    };
  }

  async update(id: number, body: UpdateUserDto, userID: number) {
    const encrypted: any = {};
    // Estos campos se pueden limpiar con null
    if (body.name !== undefined) {
      encrypted.name = body.name && this.encryption.encrypt(body.name);
    }
    if (body.paternalSurname !== undefined) {
      encrypted.paternalSurname = body.paternalSurname
        ? this.encryption.encrypt(body.paternalSurname)
        : null;
    }
    if (body.maternalSurname !== undefined) {
      encrypted.maternalSurname = body.maternalSurname
        ? this.encryption.encrypt(body.maternalSurname)
        : null;
    }
    if (body.phoneNumber !== undefined) {
      encrypted.cellphoneNumber = body.phoneNumber
        ? this.encryption.encrypt(body.phoneNumber)
        : null;
    }
    // Campos no encriptados
    if (body.gender !== undefined) encrypted.gender = body.gender;
    if (body.defaultMessage !== undefined)
      encrypted.defaultMessage = body.defaultMessage;
    if (body.sessionDurationMinutes !== undefined)
      encrypted.sessionDurationMinutes = body.sessionDurationMinutes;

    return this.prisma.appuser.update({
      where: { Id: id, status: true },
      data: {
        ...encrypted,
        updateDate: new Date(),
        AppUser_Id: userID,
      },
    });
  }

  async changePassword(
    body: { oldPassword: string; newPassword: string },
    userID: number,
  ) {
    const dbUser = await this.prisma.appuser.findUnique({
      where: { Id: userID, status: true },
    });
    if (!dbUser) throw new HttpException('User not found', 404);
    const checkPassword = await compare(body.oldPassword, dbUser.password);
    if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);
    const hashedPassword = await hash(body.newPassword, 10);

    return this.prisma.appuser.update({
      where: { status: true, Id: userID },
      data: { password: hashedPassword },
    });
  }
}
