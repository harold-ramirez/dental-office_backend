export class CreateMedicalHistoryDto {
  AppUser_Id: number;
  Patient_Id: number;
  personalPathologieshistory: {
    Id: number;
    name: string;
  }[];
  habits: {
    Id: number;
    name: string;
  }[];
  familyPathologicalHistory: string | null;
  allergies: string | null;
  pregnantMonths: string | null;
  medicalTreatment: string | null;
  takingMedicine: string | null;
  hemorrhageType: string | null;
  tmj: string | null;
  lymphNodes: string | null;
  breathingType: string | null;
  others: string | null;
  lipsStatus: string | null;
  tongueStatus: string | null;
  palateStatus: string | null;
  mouthFloorStatus: string | null;
  buccalMucousStatus: string | null;
  gumsStatus: string | null;
  prosthesisLocation: string | null;
  lastTimeVisitedDentist: string | null;
  useDentalFloss: boolean;
  useMouthWash: boolean;
  toothBrushingFrequency: string | null;
  hasBleedOnToothBrushing: boolean;
  oralHygiene: string | null;
}
