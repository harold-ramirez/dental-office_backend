import { HttpException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma.service';
import { EncryptionService } from 'src/utils/encryption.service';
import { utcNow } from 'src/utils/utc-date';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [dbPatients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where: { status: true },
        skip,
        take: pageSize,
      }),
      this.prisma.patient.count({
        where: { status: true },
      }),
    ]);

    return dbPatients
      .map((patient) => ({
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
      }))
      .sort((a, b) => {
        const fullNameA = [a.name, a.paternalSurname, a.maternalSurname]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        const fullNameB = [b.name, b.paternalSurname, b.maternalSurname]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return fullNameA.localeCompare(fullNameB);
      });
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
      complementaryimage: dbPatient.complementaryimage.map((image) => ({
        ...image,
        description: image.description
          ? this.encryption.decrypt(image.description)
          : null,
      })),
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
    const searchTerm = name.trim().toLowerCase();

    const dbPatients = await this.prisma.patient.findMany({
      where: { status: true },
    });

    const decryptedPatients = dbPatients.map((patient) => ({
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

    return decryptedPatients
      .filter((patient) => {
        const fullName = [
          patient.name,
          patient.paternalSurname,
          patient.maternalSurname,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return fullName.includes(searchTerm);
      })
      .sort((a, b) => {
        const fullNameA = [a.name, a.paternalSurname, a.maternalSurname]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        const fullNameB = [b.name, b.paternalSurname, b.maternalSurname]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return fullNameA.localeCompare(fullNameB);
      });
  }

  async create(body: CreatePatientDto, userID: number) {
    const duplicate = await this.prisma.patient.findFirst({
      where: {
        identityDocument: body.identityDocument,
        status: true,
      },
    });
    if (duplicate) throw new HttpException('Patient already exists', 409);
    const encrypted = {
      ...body,
      name: this.encryption.encrypt(body.name),
      paternalSurname: body.paternalSurname
        ? this.encryption.encrypt(body.paternalSurname)
        : null,
      maternalSurname: body.maternalSurname
        ? this.encryption.encrypt(body.maternalSurname)
        : null,
      cellphoneNumber: body.cellphoneNumber
        ? this.encryption.encrypt(body.cellphoneNumber)
        : null,
      telephoneNumber: body.telephoneNumber
        ? this.encryption.encrypt(body.telephoneNumber)
        : null,
      placeOfBirth: body.placeOfBirth
        ? this.encryption.encrypt(body.placeOfBirth)
        : null,
      address: body.address ? this.encryption.encrypt(body.address) : null,
    };
    return await this.prisma.patient.create({
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
        updateDate: utcNow(),
        AppUser_Id: userID,
      },
    });
  }

  async softDelete(id: number, userID: number) {
    return this.prisma.patient.update({
      where: { Id: id, status: true },
      data: { status: false, updateDate: utcNow(), AppUser_Id: userID },
    });
  }
}
