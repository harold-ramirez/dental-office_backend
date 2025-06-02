import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  name?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  gender?: string;
  phoneNumber?: string;
  placeOfBirth?: string;
  birthDate?: Date;
  occupation?: string;
  address?: string;
  AppUser_Id: number;
  updateDate: Date | null;
}
