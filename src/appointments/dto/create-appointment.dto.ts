export class CreateAppointmentDto {
  dateHour: Date;
  AppointmentRequest_Id?: number;
  DiagnosedProcedure_Id?: number;
  Patient_Id: number;
  minutesDuration: number;
  AppUser_Id: number;
}

export interface WeekScheduleDto {
  monday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
    notes: string | null;
    treatment: string | null;
    requestMessage: string | null;
    requestPhoneNumber: string | null;
    patientPhoneNumber: string | null;
  }[];
  tuesday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
    notes: string | null;
    requestMessage: string | null;
    requestPhoneNumber: string | null;
    patientPhoneNumber: string | null;
  }[];
  wednesday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
    notes: string | null;
    requestMessage: string | null;
    requestPhoneNumber: string | null;
    patientPhoneNumber: string | null;
  }[];
  thursday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
    notes: string | null;
    requestMessage: string | null;
    requestPhoneNumber: string | null;
    patientPhoneNumber: string | null;
  }[];
  friday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
    notes: string | null;
    requestMessage: string | null;
    requestPhoneNumber: string | null;
    patientPhoneNumber: string | null;
  }[];
  saturday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
    notes: string | null;
    requestMessage: string | null;
    requestPhoneNumber: string | null;
    patientPhoneNumber: string | null;
  }[];
  sunday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
    notes: string | null;
    requestMessage: string | null;
    requestPhoneNumber: string | null;
    patientPhoneNumber: string | null;
  }[];
}
