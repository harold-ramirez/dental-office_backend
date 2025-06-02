import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  username?: string;
  password?: string;
  name?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  gender?: string;
  phoneNumber?: string;
  AppUser_Id: number;
  updateDate: Date | null;
}
