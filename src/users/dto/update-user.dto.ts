import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto {
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
