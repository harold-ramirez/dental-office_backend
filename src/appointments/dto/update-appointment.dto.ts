import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  dateHour: Date;
  minutesDuration: number;
  Patient_Id: number;
  notes: string | null;
  AppointmentRequest_Id?: number;
  Treatment_Id?: number;
}
