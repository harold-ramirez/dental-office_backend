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

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @User() user: JwtUser) {
    return this.paymentsService.create(createPaymentDto, user.userID);
  }
}
