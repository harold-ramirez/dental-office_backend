import { Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
// import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';
import { utcDate, utcNow } from 'src/utils/utc-date';
import {
  adultTeethMapping,
  childTeethMapping,
} from 'src/utils/tooth-definitions';

@Injectable()
export class MedicalHistoryService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

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
        Id: dbHistory.Id,
        registerDate: dbHistory.registerDate,
        familyPathologicalHistory: dbHistory.familyPathologicalHistory
          ? this.encryption.decrypt(dbHistory.familyPathologicalHistory)
          : null,
        allergies: dbHistory.allergies
          ? this.encryption.decrypt(dbHistory.allergies)
          : null,
        pregnantMonths: dbHistory.pregnantMonths
          ? this.encryption.decrypt(dbHistory.pregnantMonths)
          : null,
        medicalTreatment: dbHistory.medicalTreatment
          ? this.encryption.decrypt(dbHistory.medicalTreatment)
          : null,
        takingMedicine: dbHistory.takingMedicine
          ? this.encryption.decrypt(dbHistory.takingMedicine)
          : null,
        hemorrhageType: dbHistory.hemorrhageType
          ? this.encryption.decrypt(dbHistory.hemorrhageType)
          : null,
        tmj: dbHistory.tmj ? this.encryption.decrypt(dbHistory.tmj) : null,
        lymphNodes: dbHistory.lymphNodes
          ? this.encryption.decrypt(dbHistory.lymphNodes)
          : null,
        breathingType: dbHistory.breathingType
          ? this.encryption.decrypt(dbHistory.breathingType)
          : null,
        others: dbHistory.others
          ? this.encryption.decrypt(dbHistory.others)
          : null,
        lipsStatus: dbHistory.lipsStatus
          ? this.encryption.decrypt(dbHistory.lipsStatus)
          : null,
        tongueStatus: dbHistory.tongueStatus
          ? this.encryption.decrypt(dbHistory.tongueStatus)
          : null,
        palateStatus: dbHistory.palateStatus
          ? this.encryption.decrypt(dbHistory.palateStatus)
          : null,
        mouthFloorStatus: dbHistory.mouthFloorStatus
          ? this.encryption.decrypt(dbHistory.mouthFloorStatus)
          : null,
        buccalMucousStatus: dbHistory.buccalMucousStatus
          ? this.encryption.decrypt(dbHistory.buccalMucousStatus)
          : null,
        gumsStatus: dbHistory.gumsStatus
          ? this.encryption.decrypt(dbHistory.gumsStatus)
          : null,
        prosthesisLocation: dbHistory.prosthesisLocation
          ? this.encryption.decrypt(dbHistory.prosthesisLocation)
          : null,
        lastTimeVisitedDentist: dbHistory.lastTimeVisitedDentist
          ? this.encryption.decrypt(dbHistory.lastTimeVisitedDentist)
          : null,
        useDentalFloss: dbHistory.useDentalFloss,
        useMouthWash: dbHistory.useMouthWash,
        toothBrushingFrequency: dbHistory.toothBrushingFrequency,
        hasBleedOnToothBrushing: dbHistory.hasBleedOnToothBrushing,
        oralHygiene: dbHistory.oralHygiene,
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
      });
    });
    return dtoHistories;
  }

  async create(body: CreateMedicalHistoryDto, userID: number) {
    const result = await this.prisma.$transaction(async (tx) => {
      const createdMedicalHistory = await tx.medicalhistoryform.create({
        data: {
          familyPathologicalHistory: body.familyPathologicalHistory
            ? this.encryption.encrypt(body.familyPathologicalHistory)
            : null,
          allergies: body.allergies
            ? this.encryption.encrypt(body.allergies)
            : null,
          pregnantMonths: body.pregnantMonths
            ? this.encryption.encrypt(body.pregnantMonths)
            : null,
          medicalTreatment: body.medicalTreatment
            ? this.encryption.encrypt(body.medicalTreatment)
            : null,
          takingMedicine: body.takingMedicine
            ? this.encryption.encrypt(body.takingMedicine)
            : null,
          hemorrhageType: body.hemorrhageType
            ? this.encryption.encrypt(body.hemorrhageType)
            : null,
          tmj: body.tmj ? this.encryption.encrypt(body.tmj) : null,
          lymphNodes: body.lymphNodes
            ? this.encryption.encrypt(body.lymphNodes)
            : null,
          breathingType: body.breathingType
            ? this.encryption.encrypt(body.breathingType)
            : null,
          others: body.others ? this.encryption.encrypt(body.others) : null,
          lipsStatus: body.lipsStatus
            ? this.encryption.encrypt(body.lipsStatus)
            : null,
          tongueStatus: body.tongueStatus
            ? this.encryption.encrypt(body.tongueStatus)
            : null,
          palateStatus: body.palateStatus
            ? this.encryption.encrypt(body.palateStatus)
            : null,
          mouthFloorStatus: body.mouthFloorStatus
            ? this.encryption.encrypt(body.mouthFloorStatus)
            : null,
          buccalMucousStatus: body.buccalMucousStatus
            ? this.encryption.encrypt(body.buccalMucousStatus)
            : null,
          gumsStatus: body.gumsStatus
            ? this.encryption.encrypt(body.gumsStatus)
            : null,
          prosthesisLocation: body.prosthesisLocation
            ? this.encryption.encrypt(body.prosthesisLocation)
            : null,
          lastTimeVisitedDentist: body.lastTimeVisitedDentist
            ? this.encryption.encrypt(body.lastTimeVisitedDentist)
            : null,
          useDentalFloss: body.useDentalFloss,
          useMouthWash: body.useMouthWash,
          toothBrushingFrequency: body.toothBrushingFrequency,
          hasBleedOnToothBrushing: body.hasBleedOnToothBrushing,
          oralHygiene: body.oralHygiene,
          AppUser_Id: userID,
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
        ? utcNow().getUTCFullYear() -
          utcDate(patient.birthdate).getUTCFullYear()
        : 0;
      const odontogram = await tx.odontogram.create({
        data: {
          Id: createdMedicalHistory.Id,
          model: age <= 15 ? 'child' : 'adult',
          AppUser_Id: createdMedicalHistory.AppUser_Id,
        },
      });

      const isAdult: boolean = odontogram.model === 'adult';
      const teethMapping = isAdult ? adultTeethMapping : childTeethMapping;

      await Promise.all(
        Object.entries(teethMapping).map(async ([pieceNumber, sections]) => {
          const tooth = await tx.tooth.create({
            data: {
              pieceNumber: parseInt(pieceNumber),
              Odontogram_Id: odontogram.Id,
              AppUser_Id: odontogram.AppUser_Id,
            },
          });

          await Promise.all(
            sections.map((sectionName) =>
              tx.toothsection.create({
                data: {
                  name: sectionName,
                  Tooth_Id: tooth.Id,
                },
              }),
            ),
          );
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

  async softDelete(id: number, userID: number) {
    return await this.prisma.medicalhistoryform.update({
      where: { Id: id },
      data: { status: false, updateDate: utcNow(), AppUser_Id: userID },
    });
  }
}
