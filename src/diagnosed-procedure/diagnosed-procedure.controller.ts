import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DiagnosedProcedureService } from './diagnosed-procedure.service';
import { CreateDiagnosedProcedureDto } from './dto/create-diagnosed-procedure.dto';
import { UpdateDiagnosedProcedureDto } from './dto/update-diagnosed-procedure.dto';

@Controller('diagnosed-procedure')
export class DiagnosedProcedureController {
  constructor(
    private readonly diagnosedProcedureService: DiagnosedProcedureService,
  ) {}

  @Get(':patientId')
  findAll(@Param('patientId') patientId: string) {
    return this.diagnosedProcedureService.findAll(+patientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosedProcedureService.findOne(+id);
  }

  @Post()
  create(@Body() createDiagnosedProcedureDto: CreateDiagnosedProcedureDto) {
    return this.diagnosedProcedureService.create(createDiagnosedProcedureDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiagnosedProcedureDto: UpdateDiagnosedProcedureDto,
  ) {
    return this.diagnosedProcedureService.update(
      +id,
      updateDiagnosedProcedureDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnosedProcedureService.remove(+id);
  }
}
