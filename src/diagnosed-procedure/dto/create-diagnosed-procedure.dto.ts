export class CreateDiagnosedProcedureDto {
  description: string | null;
  totalCost: number | null;
  Patient_Id: number;
  Treatment_Id: number;
  AppUser_Id: number;
  dentalPieces: number[];
}
