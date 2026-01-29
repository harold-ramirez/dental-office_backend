import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnosedProcedureDto } from './create-diagnosed-procedure.dto';

export class UpdateDiagnosedProcedureDto extends PartialType(
  CreateDiagnosedProcedureDto,
) {
  description?: string | null;
  totalCost?: number | null;
  Patient_Id: number;
  Treatment_Id: number;
}
