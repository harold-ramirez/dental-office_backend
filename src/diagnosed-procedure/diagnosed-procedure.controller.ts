import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DiagnosedProcedureService } from './diagnosed-procedure.service';
import { CreateDiagnosedProcedureDto } from './dto/create-diagnosed-procedure.dto';
import { UpdateDiagnosedProcedureDto } from './dto/update-diagnosed-procedure.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('diagnosed-procedure')
export class DiagnosedProcedureController {
  constructor(
    private readonly diagnosedProcedureService: DiagnosedProcedureService,
  ) {}

  @Get('pending-payments')
  pendingPayments() {
    return this.diagnosedProcedureService.pendingPayments();
  }

  @Get(':patientId/preview')
  preview(@Param('patientId') patientId: string) {
    return this.diagnosedProcedureService.preview(+patientId);
  }

  @Get(':patientId')
  findAll(@Param('patientId') patientId: string) {
    return this.diagnosedProcedureService.findAll(+patientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosedProcedureService.findOne(+id);
  }

  @Post()
  create(@Body() body: CreateDiagnosedProcedureDto, @User() user: JwtUser) {
    return this.diagnosedProcedureService.create(body, user.userID);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateDiagnosedProcedureDto,
    @User() user: JwtUser
  ) {
    return this.diagnosedProcedureService.update(
      +id,
      body,
      user.userID
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: JwtUser) {
    return this.diagnosedProcedureService.remove(+id, user.userID);
  }
}
