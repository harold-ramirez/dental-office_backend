export class CreatePatientDto {
  name: string;
  paternalSurname?: string;
  maternalSurname?: string;
  gender: string;
  identityDocument: string;
  cellphoneNumber?: string;
  telephoneNumber?: string;
  placeOfBirth?: string;
  birthdate?: Date;
  occupation?: string;
  address?: string;
}
