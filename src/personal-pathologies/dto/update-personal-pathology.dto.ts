import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalPathologyDto } from './create-personal-pathology.dto';

export class UpdatePersonalPathologyDto extends PartialType(CreatePersonalPathologyDto) {
  name?: string;
  AppUser_Id: number;
  updateDate: Date | null;
}
