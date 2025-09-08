// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { ParentsModule } from './modules/parents/parents.module';
import { RelationsModule } from './modules/relations/relations.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { AdminModule } from './modules/admin/admin.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { SettingsModule } from './modules/settings/settings.module';
import { FilesModule } from './modules/files/files.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { RendezVousModule } from './modules/rendez-vous/rendez-vous.module';
import { PdpModule } from './modules/pdp/pdp.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    StudentsModule,
    ParentsModule,
    RelationsModule,
    QuizzesModule,
    AdminModule,
    MessagingModule,
    SettingsModule,
    FilesModule,
    MeetingsModule,
    RendezVousModule,
    PdpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}