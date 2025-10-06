import { PartialType } from '@nestjs/mapped-types';
import { CreateImageDto } from './create-image.dto';

export class UpdateImageDto extends PartialType(CreateImageDto) {
  captureDate?: Date | null;
  description?: string | null;
  Patient_Id: number;
  AppUser_Id: number;
}
