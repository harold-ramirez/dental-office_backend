import { PartialType } from '@nestjs/mapped-types';
import { CreateOdontogramDto } from './create-odontogram.dto';

export class UpdateOdontogramDto extends PartialType(CreateOdontogramDto) {}
