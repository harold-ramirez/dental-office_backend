import { Module } from '@nestjs/common';
import { TreatmentsModule } from './treatments/treatments.module';
import { UsersModule } from './users/users.module';
import { ShiftsModule } from './shifts/shifts.module';
import { PersonalPathologiesModule } from './personal-pathologies/personal-pathologies.module';
import { PatientsModule } from './patients/patients.module';
import { HabitsModule } from './habits/habits.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AppointmentRequestsModule } from './appointment-requests/appointment-requests.module';

@Module({
  imports: [
    TreatmentsModule,
    UsersModule,
    ShiftsModule,
    PersonalPathologiesModule,
    PatientsModule,
    HabitsModule,
    AppointmentsModule,
    AppointmentRequestsModule,
  ],
})
export class AppModule {}
