export class CreateUserDto {
  username: string;
  password: string;
  name: string;
  paternalSurname?: string;
  maternalSurname?: string;
  gender: string;
  phoneNumber: string;
  AppUser_Id: number;
}
