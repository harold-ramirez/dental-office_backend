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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('/procedure/:diagnosedProcedureId')
  findAll(@Param('diagnosedProcedureId') diagnosedProcedureId: string) {
    return this.paymentsService.findAll(+diagnosedProcedureId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @User() user: JwtUser) {
    return this.paymentsService.create(createPaymentDto, user.userID);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto, @User() user: JwtUser) {
    return this.paymentsService.update(+id, updatePaymentDto, user.userID);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
