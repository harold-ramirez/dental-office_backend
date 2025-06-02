export class CreatePatientDto {
  name: string;
  paternalSurname?: string;
  maternalSurname?: string;
  gender: string;
  phoneNumber?: string;
  placeOfBirth: string;
  birthdate: Date;
  occupation?: string;
  address?: string;
  AppUser_Id: number;
}
