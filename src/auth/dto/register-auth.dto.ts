export class RegisterAuthDto {
  username: string;
  password: string;
  name: string;
  paternalSurname: string | null;
  maternalSurname: string | null;
  gender: string;
  phoneNumber: string;
  defaultMessage: string | null;
  sessionDurationMinutes: number;
  AppUser_Id: number;
}
