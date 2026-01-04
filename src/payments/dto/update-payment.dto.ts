import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  amount?: number;
  DiagnosedProcedure_Id: number;
  AppUser_Id: number;
}
