import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { utcNow } from 'src/utils/utc-date';

@Injectable()
export class OdontogramService {
  constructor(private prisma: PrismaService) {}

  async preview(patientID: number) {
    return await this.prisma.odontogram.findMany({
      where: { status: true, medicalhistoryform: { Patient_Id: patientID } },
      orderBy: { registerDate: 'desc' },
      select: { registerDate: true },
    });
  }

  async findAll(patientID: number) {
    const data = await this.prisma.odontogram.findMany({
      orderBy: { registerDate: 'desc' },
      where: {
        status: true,
        medicalhistoryform: {
          Patient_Id: patientID,
          status: true,
        },
      },
      select: {
        Id: true,
        model: true,
        registerDate: true,
        updateDate: true,
        tooth: {
          select: {
            Id: true,
            pieceNumber: true,
            localStatus: true,
            toothsection: {
              select: {
                Id: true,
                name: true,
                localStatus: true,
              },
            },
          },
        },
      },
    });

    return data.map((odontogram) => ({
      ...odontogram,
      Id: Number(odontogram.Id),
      tooth: odontogram.tooth.map((t) => ({
        ...t,
        Id: Number(t.Id),
        toothsection: t.toothsection.map((ts) => ({
          ...ts,
          Id: Number(ts.Id),
        })),
      })),
    }));
  }

  async update(
    id: number,
    body: { toothSectionId: number; localStatus: string }[],
  ) {
    const odontogram = await this.prisma.odontogram.findUnique({
      where: { Id: id, status: true },
    });
    if (!odontogram) throw new HttpException('Odontogram not found', 404);
    const updated = await this.prisma.$transaction(async (tx) => {
      await Promise.all(
        body.map(async (item) => {
          await tx.toothsection.update({
            where: { Id: item.toothSectionId },
            data: { localStatus: item.localStatus },
          });
        }),
      );
      return await tx.odontogram.update({
        where: { Id: id, status: true },
        data: { updateDate: utcNow() },
      });
    });
    return updated;
  }
}
