import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  name?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  gender?: string;
  cellphoneNumber?: string;
  telephoneNumber?: string;
  placeOfBirth?: string;
  birthDate?: Date;
  occupation?: string;
  address?: string;
  AppUser_Id: number;
}
