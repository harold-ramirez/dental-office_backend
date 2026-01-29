export class UpdateUserDto {
  username?: string;
  password?: string;
  name?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  gender?: string;
  phoneNumber?: string;
  defaultMessage?: string;
  sessionDurationMinutes: number;
  updateDate: Date | null;
}
