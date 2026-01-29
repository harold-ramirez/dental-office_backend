import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import { join } from 'path';
import { EncryptionService } from 'src/utils/encryption.service';

@Injectable()
export class ImagesService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async findAll(patientId: number) {
    const images = await this.prisma.complementaryimage.findMany({
      select: {
        Id: true,
        fileName: true,
        captureDate: true,
        description: true,
        registerDate: true,
        updateDate: true,
        appuser: {
          select: {
            username: true,
          },
        },
      },
      where: {
        Patient_Id: patientId,
        status: true,
      },
      orderBy: {
        registerDate: 'desc',
      },
    });
    return images.map((img) => ({
      Id: img.Id,
      filename: img.fileName,
      captureDate: img.captureDate,
      description: img.description
        ? this.encryption.decrypt(img.description)
        : null,
      registerDate: img.registerDate,
      updateDate: img.updateDate,
      user: img.appuser.username,
    }));
  }

  async create(
    body: CreateImageDto,
    image: Express.Multer.File,
    userID: number,
  ) {
    return await this.prisma.complementaryimage.create({
      data: {
        fileName: image.filename,
        captureDate: body.captureDate,
        description: body.description
          ? this.encryption.encrypt(body.description)
          : null,
        Patient_Id: +body.Patient_Id,
        AppUser_Id: userID,
      },
    });
  }

  async update(id: number, body: UpdateImageDto, userID: number) {
    const img = await this.prisma.complementaryimage.findUnique({
      where: { Id: id },
    });
    if (!img) throw new HttpException('IMAGE_NOT_FOUND', 404);

    return await this.prisma.complementaryimage.update({
      where: { Id: id },
      data: {
        captureDate: body.captureDate ? body.captureDate : null,
        description: body.description
          ? this.encryption.encrypt(body.description)
          : null,
        Patient_Id: body.Patient_Id,
        AppUser_Id: userID,
      },
    });
  }

  async remove(imgId: number) {
    try {
      // Search image to get file name
      const img = await this.prisma.complementaryimage.findUnique({
        where: { Id: imgId },
      });
      if (!img) throw new HttpException('IMAGE_NOT_FOUND', 404);

      // Delete physical file
      const filePath = join(__dirname, '..', '..', 'uploads', img.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return this.prisma.complementaryimage.delete({
        where: {
          Id: imgId,
        },
      });
    } catch (error) {
      console.log('Error while deleting image:', error);
      throw new InternalServerErrorException('Error al eliminar imagen');
    }
  }
}
