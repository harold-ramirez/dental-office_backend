import { Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
// import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MedicalHistoryService {
  constructor(private prisma: PrismaService) {}

  async preview(id: number) {
    return await this.prisma.medicalhistoryform.findMany({
      where: { status: true, Patient_Id: id },
      orderBy: { registerDate: 'desc' },
      select: { registerDate: true },
    });
  }

  async findAll(id: number) {
    const dbMedicalHistories = await this.prisma.medicalhistoryform.findMany({
      where: { status: true, Patient_Id: id },
      orderBy: { registerDate: 'desc' },
      select: {
        Id: true,
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
        familyPathologicalHistory: true,
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
        hasBleedOnToothBrushing: true,
        oralHygiene: true,
        registerDate: true,
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
        Id: dbHistory.Id,
        registerDate: dbHistory.registerDate,
        familyPathologicalHistory: dbHistory.familyPathologicalHistory,
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
        useDentalFloss: dbHistory.useDentalFloss,
        useMouthWash: dbHistory.useMouthWash,
        toothBrushingFrequency: dbHistory.toothBrushingFrequency,
        hasBleedOnToothBrushing: dbHistory.hasBleedOnToothBrushing,
        oralHygiene: dbHistory.oralHygiene,
      });
    });
    return dtoHistories;
  }

  async create(body: CreateMedicalHistoryDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const createdMedicalHistory = await tx.medicalhistoryform.create({
        data: {
          familyPathologicalHistory: body.familyPathologicalHistory,
          allergies: body.allergies,
          pregnantMonths: body.pregnantMonths,
          medicalTreatment: body.medicalTreatment,
          takingMedicine: body.takingMedicine,
          hemorrhageType: body.hemorrhageType,
          tmj: body.tmj,
          lymphNodes: body.lymphNodes,
          breathingType: body.breathingType,
          others: body.others,
          lipsStatus: body.lipsStatus,
          tongueStatus: body.tongueStatus,
          palateStatus: body.palateStatus,
          mouthFloorStatus: body.mouthFloorStatus,
          buccalMucousStatus: body.buccalMucousStatus,
          gumsStatus: body.gumsStatus,
          prosthesisLocation: body.prosthesisLocation,
          lastTimeVisitedDentist: body.lastTimeVisitedDentist,
          useDentalFloss: body.useDentalFloss,
          useMouthWash: body.useMouthWash,
          toothBrushingFrequency: body.toothBrushingFrequency,
          hasBleedOnToothBrushing: body.hasBleedOnToothBrushing,
          oralHygiene: body.oralHygiene,
          AppUser_Id: body.AppUser_Id,
          Patient_Id: body.Patient_Id,
        },
      });
      const registeredPathologies = await Promise.all(
        body.personalPathologieshistory.map((pathology) => {
          return tx.medicalhistoryform_personalpathologicalhistory.create({
            data: {
              MedicalHistoryForm_Id: createdMedicalHistory.Id,
              PersonalPathologicalHistory_Id: pathology.Id,
            },
          });
        }),
      );
      const registeredHabits = await Promise.all(
        body.habits.map((habit) => {
          return tx.medicalhistoryform_habits.create({
            data: {
              MedicalHistoryForm_Id: createdMedicalHistory.Id,
              Habits_Id: habit.Id,
            },
          });
        }),
      );

      return {
        registeredPathologies,
        registeredHabits,
        createdMedicalHistory,
      };
    });
    return result;
  }

  // async update(id: number, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
  //   return `This action updates a #${id} medicalHistory`;
  // }

  async softDelete(id: number) {
    return await this.prisma.medicalhistoryform.update({
      where: { Id: id },
      data: { status: false, updateDate: new Date() },
    });
  }
}
