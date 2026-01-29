import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { EncryptionService } from 'src/utils/encryption.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, EncryptionService],
})
export class ImagesModule {}
