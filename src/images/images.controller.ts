import {
  Controller,
  Res,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const uploadRoot = resolve(process.cwd(), uploadDir);

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('/:patientId')
  findAll(@Param('patientId') patientId: string) {
    return this.imagesService.findAll(+patientId);
  }

  @Get('/file/:filename')
  getImageFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: uploadRoot });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          fs.mkdirSync(uploadRoot, { recursive: true });
          cb(null, uploadRoot);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createImageDto: CreateImageDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: JwtUser,
  ) {
    return this.imagesService.create(createImageDto, image, user.userID);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @User() user: JwtUser,
  ) {
    return this.imagesService.update(+id, updateImageDto, user.userID);
  }

  @Delete('/:imgId')
  remove(@Param('imgId') imgId: string) {
    return this.imagesService.remove(+imgId);
  }
}
