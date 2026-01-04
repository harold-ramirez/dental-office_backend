export class CreateMedicalHistoryDto {
  AppUser_Id: number;
  Patient_Id: number;
  personalPathologieshistory: [];
  habits: [];
  allergies: string;
  pregnantMonths: string;
  medicalTreatment: string;
  takingMedicine: string;
  hemorrhageType: string;
  tmj: string;
  lymphNodes: string;
  breathingType: string;
  others: string;
  lipsStatus: string;
  tongueStatus: string;
  palateStatus: string;
  mouthFloorStatus: string;
  buccalMucousStatus: string;
  gumsStatus: string;
  prosthesisLocation: string;
  lastTimeVisitedDentist: string;
  useDentalFloss: Boolean;
  useMouthWash: Boolean;
  toothBrushingFrequency: string;
  bleedingTypeDuringToothBrushing: Boolean;
  oralHygiene: string;
}
