import { Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { PrismaService } from 'src/prisma.service';
import { PersonalPathologiesController } from 'src/personal-pathologies/personal-pathologies.controller';

@Injectable()
export class MedicalHistoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(id: number) {
    const dbMedicalHistories = await this.prisma.medicalhistoryform.findMany({
      where: { status: true, Patient_Id: id},
      orderBy: { registerDate: 'desc' },
      select: {
        AppUser_Id: true,
        Patient_Id: true,
        medicalhistoryform_personalpathologicalhistory: {
          select: {
            personalpathologicalhistory: {
              select: {
                Id: true,
                name: true,
              },
            },
          },
        },
        medicalhistoryform_habits: {
          select: {
            habits: {
              select: {
                Id: true,
                name: true,
              },
            },
          },
        },
        allergies: true,
        pregnantMonths: true,
        medicalTreatment: true,
        takingMedicine: true,
        hemorrhageType: true,
        tmj: true,
        lymphNodes: true,
        breathingType: true,
        others: true,
        lipsStatus: true,
        tongueStatus: true,
        palateStatus: true,
        mouthFloorStatus: true,
        buccalMucousStatus: true,
        gumsStatus: true,
        prosthesisLocation: true,
        lastTimeVisitedDentist: true,
        useDentalFloss: true,
        useMouthWash: true,
        toothBrushingFrequency: true,
        bleedingTypeDuringToothBrushing: true,
        oralHygiene: true,
      },
    });
    const dtoHistories: any = [];
    dbMedicalHistories.forEach((dbHistory) => {
      dtoHistories.push({
        personalPathologieshistory:
          dbHistory.medicalhistoryform_personalpathologicalhistory.map(
            (history) => {
              return {
                Id: history.personalpathologicalhistory.Id,
                name: history.personalpathologicalhistory.name,
              };
            },
          ),

        habits: dbHistory.medicalhistoryform_habits.map((habit) => {
          return {
            Id: habit.habits.Id,
            name: habit.habits.name,
          };
        }),
        allergies: dbHistory.allergies,
        pregnantMonths: dbHistory.pregnantMonths,
        medicalTreatment: dbHistory.medicalTreatment,
        takingMedicine: dbHistory.takingMedicine,
        hemorrhageType: dbHistory.hemorrhageType,
        tmj: dbHistory.tmj,
        lymphNodes: dbHistory.lymphNodes,
        breathingType: dbHistory.breathingType,
        others: dbHistory.others,
        lipsStatus: dbHistory.lipsStatus,
        tongueStatus: dbHistory.tongueStatus,
        palateStatus: dbHistory.palateStatus,
        mouthFloorStatus: dbHistory.mouthFloorStatus,
        buccalMucousStatus: dbHistory.buccalMucousStatus,
        gumsStatus: dbHistory.gumsStatus,
        prosthesisLocation: dbHistory.prosthesisLocation,
        lastTimeVisitedDentist: dbHistory.lastTimeVisitedDentist,
        useDentalFloss: dbHistory.useDentalFloss ? 'Y' : 'N',
        useMouthWash: dbHistory.useMouthWash ? 'Y' : 'N',
        toothBrushingFrequency: dbHistory.toothBrushingFrequency,
        bleedingTypeDuringToothBrushing:
          dbHistory.bleedingTypeDuringToothBrushing ? 'Y' : 'N',
        oralHygiene: dbHistory.oralHygiene,
      });
    });
    return dtoHistories;
  }

  async create(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    return 'This action adds a new medicalHistory';
  }

  async update(id: number, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    return `This action updates a #${id} medicalHistory`;
  }
}
