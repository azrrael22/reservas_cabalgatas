import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CaballosModule } from './caballos/caballos.module';
import { GuiasModule } from './guias/guias.module';
import { MailModule } from './mail/mail.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { RutasModule } from './rutas/rutas.module';
import { SalidasModule } from './salidas/salidas.module';
import { ReservacionesModule } from './reservaciones/reservaciones.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        database: config.get<string>('POSTGRES_DB'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        entities: [join(__dirname, '**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, 'database/migrations/*{.ts,.js}')],
        migrationsRun: true,
        synchronize: false,
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UsuariosModule,
    CaballosModule,
    GuiasModule,
    MailModule,
    NotificacionesModule,
    RutasModule,
    SalidasModule,
    ReservacionesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
