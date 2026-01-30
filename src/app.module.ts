import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TreatmentsModule } from './treatments/treatments.module';
import { UsersModule } from './users/users.module';
import { ShiftsModule } from './shifts/shifts.module';
import { PersonalPathologiesModule } from './personal-pathologies/personal-pathologies.module';
import { PatientsModule } from './patients/patients.module';
import { HabitsModule } from './habits/habits.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AppointmentRequestsModule } from './appointment-requests/appointment-requests.module';
import { ImagesModule } from './images/images.module';
import { MulterModule } from '@nestjs/platform-express';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { GatewayModule } from './websocket/websocket.module';
// import { join } from 'path';
import { DiagnosedProcedureModule } from './diagnosed-procedure/diagnosed-procedure.module';
import { PaymentsModule } from './payments/payments.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { OdontogramModule } from './odontogram/odontogram.module';
import { AuthModule } from './auth/auth.module';
import { EncryptionService } from './utils/encryption.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    //   serveRoot: '/uploads',
    // }),
    TreatmentsModule,
    UsersModule,
    ShiftsModule,
    PersonalPathologiesModule,
    PatientsModule,
    HabitsModule,
    AppointmentsModule,
    AppointmentRequestsModule,
    ImagesModule,
    GatewayModule,
    DiagnosedProcedureModule,
    PaymentsModule,
    MedicalHistoryModule,
    OdontogramModule,
    AuthModule,
  ],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class AppModule {}
