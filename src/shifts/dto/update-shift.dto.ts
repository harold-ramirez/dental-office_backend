import { PartialType } from '@nestjs/mapped-types';
import { CreateShiftDto } from './create-shift.dto';

export class UpdateShiftDto extends PartialType(CreateShiftDto) {
  entryHour?: string;
  exitHour?: string;
  WorkDay_Id?: number;
  AppUser_Id: number;
  updateDate: Date | null;
}
