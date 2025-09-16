export class CreateAppointmentDto {
  dateHour: Date;
  AppointmentRequest_Id?: number;
  DiagnosedProcedure_Id?: number;
  Patient_Id: number;
  minutesDuration: number;
  AppUser_Id: number;
}
