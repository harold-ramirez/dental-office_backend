import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  dateHour?: Date;
  AppointmentRequest_Id?: number;
  DiagnosedProcedure_Id?: number;
  AppUser_Id: number;
  Patient_Id: number;
  updateDate: Date | null;
}
