export class CreateAppointmentRequestDto {
  patientFullName: string;
  dateHourRequest: Date;
  phoneNumber: string;
  message: string;
  AppUser_Id?: number;
}
