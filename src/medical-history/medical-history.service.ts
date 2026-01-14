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
      const patient = await tx.patient.findUnique({
        where: { Id: createdMedicalHistory.Patient_Id },
      });
      const age = patient?.birthdate
        ? new Date().getFullYear() - new Date(patient.birthdate).getFullYear()
        : 0;
      const odontogram = await tx.odontogram.create({
        data: {
          Id: createdMedicalHistory.Id,
          model: age <= 15 ? 'child' : 'adult',
          AppUser_Id: createdMedicalHistory.AppUser_Id,
        },
      });

      const isAdult: boolean = odontogram.model === 'adult';

      // Teeth
      const minTeethNumber = isAdult ? 1 : 5;
      const maxTeethNumber = isAdult ? 8 : 5;
      const teethToCreate: any[] = [];
      for (let i = minTeethNumber; i <= minTeethNumber + 3; i++) {
        for (let j = 1; j <= maxTeethNumber; j++) {
          teethToCreate.push({
            pieceNumber: i * 10 + j,
            Odontogram_Id: odontogram.Id,
            AppUser_Id: odontogram.AppUser_Id,
          });
        }
      }
      const createdTeeth = await Promise.all(
        teethToCreate.map((tooth) => tx.tooth.create({ data: tooth })),
      );

      // Tooth Sections
      const piecesPerTooth = isAdult
        ? [5, 5, 5, 6, 6, 8, 8, 8]
        : [5, 5, 5, 8, 8];

      const teethPerQuadrant = isAdult ? 8 : 5;
      const quadrants = 4;

      await Promise.all(
        Array.from({ length: quadrants }).flatMap((_, quadrantIndex) =>
          createdTeeth
            .slice(
              quadrantIndex * teethPerQuadrant,
              (quadrantIndex + 1) * teethPerQuadrant,
            )
            .flatMap((tooth, toothIndex) =>
              Array.from({ length: piecesPerTooth[toothIndex] }).map(() =>
                tx.toothsection.create({
                  data: {
                    Tooth_Id: tooth.Id,
                  },
                }),
              ),
            ),
        ),
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
