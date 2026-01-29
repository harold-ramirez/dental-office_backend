import { Module } from '@nestjs/common';
import { OdontogramService } from './odontogram.service';
import { OdontogramController } from './odontogram.controller';

@Module({
  controllers: [OdontogramController],
  providers: [OdontogramService],
})
export class OdontogramModule {}
