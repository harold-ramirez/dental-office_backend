import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

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
    const imagesDto = images.map((img) => {
      const imageDto = {
        Id: img.Id,
        filename: img.fileName,
        captureDate: img.captureDate,
        description: img.description,
        registerDate: img.registerDate,
        updateDate: img.updateDate,
        user: img.appuser.username,
      };
      return imageDto;
    });
    return imagesDto;
  }

  async create(createImageDto: CreateImageDto, image: Express.Multer.File) {
    const apiUrl = process.env.API_URL;
    const img = await this.prisma.complementaryimage.create({
      data: {
        fileName: image.filename,
        captureDate: createImageDto.captureDate,
        description: createImageDto.description,
        Patient_Id: +createImageDto.Patient_Id,
        AppUser_Id: +createImageDto.AppUser_Id,
      },
    });
    return img;
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const img = await this.prisma.complementaryimage.findUnique({
      where: {
        Id: id,
      },
    });
    if (!img) {
      throw new NotFoundException('Imagen no encontrada');
    }
    const updatedImg = await this.prisma.complementaryimage.update({
      where: {
        Id: id,
      },
      data: {
        captureDate: updateImageDto.captureDate ?? img.captureDate,
        description: updateImageDto.description ?? img.description,
        Patient_Id: updateImageDto.Patient_Id,
        AppUser_Id: updateImageDto.AppUser_Id,
      },
    });
    return updatedImg;
  }

  async remove(imgId: number) {
    try {
      // Search image to get file name
      const img = await this.prisma.complementaryimage.findUnique({
        where: { Id: imgId },
      });
      if (!img) throw new NotFoundException('Imagen no encontrada');

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
