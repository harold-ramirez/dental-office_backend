export class CreateAppointmentDto {
  dateHour: Date;
  AppointmentRequest_Id?: number;
  DiagnosedProcedure_Id?: number;
  AppUser_Id: number;
  Patient_Id: number;
}
