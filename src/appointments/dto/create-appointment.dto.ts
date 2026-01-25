export class CreateAppointmentDto {
  dateHour: Date;
  AppointmentRequest_Id?: number;
  DiagnosedProcedure_Id?: number;
  Patient_Id: number;
  minutesDuration: number;
  AppUser_Id: number;
}

export interface AppointmentHistoryDto {
  dateHour: Date;
  minutesDuration: number;
  requestMessage: string | null;
  treatment: string | null;
}

export interface WeekScheduleDto {
  monday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
  }[];
  tuesday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
  }[];
  wednesday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
  }[];
  thursday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
  }[];
  friday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
  }[];
  saturday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
  }[];
  sunday: {
    Id: number;
    dateHour: Date;
    patient: string;
    minutesDuration: number;
  }[];
}
