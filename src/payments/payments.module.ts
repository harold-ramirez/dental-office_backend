import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, EncryptionService],
})
export class PaymentsModule {}
