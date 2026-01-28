import { HttpException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async findAll() {
    const dbPatients = await this.prisma.patient.findMany({
      where: { status: true },
      orderBy: { registerDate: 'desc' },
    });

    return dbPatients.map((patient) => ({
      ...patient,
      name: this.encryption.decrypt(patient.name),
      paternalSurname: patient.paternalSurname
        ? this.encryption.decrypt(patient.paternalSurname)
        : null,
      maternalSurname: patient.maternalSurname
        ? this.encryption.decrypt(patient.maternalSurname)
        : null,
      cellphoneNumber: patient.cellphoneNumber
        ? this.encryption.decrypt(patient.cellphoneNumber)
        : null,
      telephoneNumber: patient.telephoneNumber
        ? this.encryption.decrypt(patient.telephoneNumber)
        : null,
      placeOfBirth: patient.placeOfBirth
        ? this.encryption.decrypt(patient.placeOfBirth)
        : null,
      address: patient.address
        ? this.encryption.decrypt(patient.address)
        : null,
    }));
  }

  async getPatientsNames() {
    const dbPatients = await this.prisma.patient.findMany({
      where: { status: true },
      orderBy: { name: 'desc' },
      select: {
        Id: true,
        name: true,
        paternalSurname: true,
        maternalSurname: true,
      },
    });

    return dbPatients.map((patient) => {
      const decriptedName = this.encryption.decrypt(patient.name);
      const decriptedPaternalSurname = patient.paternalSurname
        ? this.encryption.decrypt(patient.paternalSurname)
        : null;
      const decriptedMaternalSurname = patient.maternalSurname
        ? this.encryption.decrypt(patient.maternalSurname)
        : null;
      return {
        id: patient.Id,
        fullName: [
          decriptedName,
          decriptedPaternalSurname,
          decriptedMaternalSurname,
        ]
          .filter(Boolean)
          .join(' '),
      };
    });
  }

  async findOne(id: number) {
    const dbPatient = await this.prisma.patient.findUnique({
      where: { Id: id, status: true },
      select: {
        Id: true,
        name: true,
        paternalSurname: true,
        maternalSurname: true,
        gender: true,
        identityDocument: true,
        cellphoneNumber: true,
        telephoneNumber: true,
        placeOfBirth: true,
        birthdate: true,
        occupation: true,
        address: true,
        complementaryimage: {
          select: {
            Id: true,
            fileName: true,
            captureDate: true,
            description: true,
          },
        },
        registerDate: true,
        updateDate: true,
        appuser: {
          select: {
            Id: true,
            username: true,
          },
        },
      },
    });

    if (!dbPatient) throw new HttpException('Patient not found', 404);

    return {
      ...dbPatient,
      name: this.encryption.decrypt(dbPatient.name),
      paternalSurname: dbPatient.paternalSurname
        ? this.encryption.decrypt(dbPatient.paternalSurname)
        : null,
      maternalSurname: dbPatient.maternalSurname
        ? this.encryption.decrypt(dbPatient.maternalSurname)
        : null,
      cellphoneNumber: dbPatient.cellphoneNumber
        ? this.encryption.decrypt(dbPatient.cellphoneNumber)
        : null,
      telephoneNumber: dbPatient.telephoneNumber
        ? this.encryption.decrypt(dbPatient.telephoneNumber)
        : null,
      placeOfBirth: dbPatient.placeOfBirth
        ? this.encryption.decrypt(dbPatient.placeOfBirth)
        : null,
      address: dbPatient.address
        ? this.encryption.decrypt(dbPatient.address)
        : null,
    };
  }

  async searchByName(name: string) {
    const words = name.trim().split(/\s+/);
    const dbPatients = await this.prisma.patient.findMany({
      where: {
        status: true,
        AND: words.map((word) => ({
          OR: [
            { name: { contains: word } },
            { paternalSurname: { contains: word } },
            { maternalSurname: { contains: word } },
          ],
        })),
      },
      select: {
        Id: true,
        name: true,
        paternalSurname: true,
        maternalSurname: true,
      },
    });

    return dbPatients.map((patient) => ({
      ...patient,
      name: this.encryption.decrypt(patient.name),
      paternalSurname: patient.paternalSurname
        ? this.encryption.decrypt(patient.paternalSurname)
        : null,
      maternalSurname: patient.maternalSurname
        ? this.encryption.decrypt(patient.maternalSurname)
        : null,
    }));
  }

  async create(createPatientDto: CreatePatientDto, userID: number) {
    const encrypted = {
      ...createPatientDto,
      name: this.encryption.encrypt(createPatientDto.name),
      paternalSurname: createPatientDto.paternalSurname
        ? this.encryption.encrypt(createPatientDto.paternalSurname)
        : null,
      maternalSurname: createPatientDto.maternalSurname
        ? this.encryption.encrypt(createPatientDto.maternalSurname)
        : null,
      cellphoneNumber: createPatientDto.cellphoneNumber
        ? this.encryption.encrypt(createPatientDto.cellphoneNumber)
        : null,
      telephoneNumber: createPatientDto.telephoneNumber
        ? this.encryption.encrypt(createPatientDto.telephoneNumber)
        : null,
      placeOfBirth: createPatientDto.placeOfBirth
        ? this.encryption.encrypt(createPatientDto.placeOfBirth)
        : null,
      address: createPatientDto.address
        ? this.encryption.encrypt(createPatientDto.address)
        : null,
    };
    return this.prisma.patient.create({
      data: {
        ...encrypted,
        AppUser_Id: userID,
      },
    });
  }

  async update(id: number, body: UpdatePatientDto, userID: number) {
    const encrypted: any = {};
    // Estos campos se pueden limpiar con null
    if (body.name !== undefined) {
      encrypted.name = body.name && this.encryption.encrypt(body.name);
    }
    if (body.paternalSurname !== undefined) {
      encrypted.paternalSurname = body.paternalSurname
        ? this.encryption.encrypt(body.paternalSurname)
        : null;
    }
    if (body.maternalSurname !== undefined) {
      encrypted.maternalSurname = body.maternalSurname
        ? this.encryption.encrypt(body.maternalSurname)
        : null;
    }
    if (body.cellphoneNumber !== undefined) {
      encrypted.cellphoneNumber = body.cellphoneNumber
        ? this.encryption.encrypt(body.cellphoneNumber)
        : null;
    }
    if (body.telephoneNumber !== undefined) {
      encrypted.telephoneNumber = body.telephoneNumber
        ? this.encryption.encrypt(body.telephoneNumber)
        : null;
    }
    if (body.placeOfBirth !== undefined) {
      encrypted.placeOfBirth = body.placeOfBirth
        ? this.encryption.encrypt(body.placeOfBirth)
        : null;
    }
    if (body.address !== undefined) {
      encrypted.address = body.address
        ? this.encryption.encrypt(body.address)
        : null;
    }

    // Campos no encriptados
    if (body.gender !== undefined) encrypted.gender = body.gender;
    if (body.birthdate !== undefined) encrypted.birthdate = body.birthdate;
    if (body.occupation !== undefined) encrypted.occupation = body.occupation;
    if (body.identityDocument !== undefined)
      encrypted.identityDocument = body.identityDocument;

    return this.prisma.patient.update({
      where: { Id: id, status: true },
      data: {
        ...encrypted,
        updateDate: new Date(),
        AppUser_Id: userID,
      },
    });
  }

  async softDelete(id: number, userID: number) {
    return this.prisma.patient.update({
      where: { Id: id, status: true },
      data: { status: false, updateDate: new Date(), AppUser_Id: userID },
    });
  }
}
