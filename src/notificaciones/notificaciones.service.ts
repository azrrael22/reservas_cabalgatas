import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { GoogleCalendarService } from './google-calendar/google-calendar.service';
import { ResumenSalida } from './dto/resumen-salida.dto';
import { Usuario, RolUsuario } from '../usuarios/entities/usuario.entity';

const QUERY_RESUMEN = `
  SELECT
    s.id::int                                    AS "id",
    s.fecha_programada                           AS "fechaProgramada",
    s.tiempo_inicio                              AS "tiempoInicio",
    s.tiempo_fin                                 AS "tiempoFin",
    s.estado,
    r.nombre                                     AS "rutaNombre",
    r.duracion_minutos::int                      AS "duracionMinutos",
    COALESCE(SUM(res.num_people), 0)::int        AS "totalPersonas"
  FROM salidas s
  INNER JOIN rutas r ON s.ruta_id = r.id
  LEFT JOIN reservaciones res
    ON res.salida_id = s.id AND res.estado != 'cancelado'
  WHERE $WHERE
    AND s.estado IN ('programado', 'en_curso')
  GROUP BY s.id, r.nombre, r.duracion_minutos,
           s.fecha_programada, s.tiempo_inicio, s.tiempo_fin, s.estado
  ORDER BY s.fecha_programada ASC, s.tiempo_inicio ASC
`;

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  @Cron(process.env.NOTIFICACIONES_CRON ?? '0 12 * * *')
  async cronDiario(): Promise<void> {
    const dias = parseInt(this.config.get<string>('NOTIFICACIONES_DIAS_DEFECTO', '7'));
    this.logger.log(`Ejecutando cron de notificaciones — próximos ${dias} días`);
    await this.enviarNotificaciones(dias);
  }

  async enviarNotificaciones(dias: number): Promise<void> {
    const salidas = await this.obtenerSalidasResumen(dias);
    const admin = await this.obtenerAdmin();
    if (!admin) {
      this.logger.warn('No se encontró admin en la BD — notificaciones no enviadas');
      return;
    }

    await Promise.allSettled([
      this.mailService.notificarResumenAdmin(admin, salidas, dias),
      this.googleCalendarService.sincronizarSalidas(salidas),
    ]);
  }

  async notificarCambioSalida(salidaId: number): Promise<void> {
    const salida = await this.obtenerResumenSalida(salidaId);
    if (!salida) return;

    const admin = await this.obtenerAdmin();
    if (!admin) return;

    await Promise.allSettled([
      this.mailService.notificarCambioSalidaAdmin(admin, salida),
      this.googleCalendarService.sincronizarSalida(salida),
    ]);
  }

  private async obtenerSalidasResumen(dias: number): Promise<ResumenSalida[]> {
    const hoy = new Date().toISOString().slice(0, 10);
    const hasta = new Date(Date.now() + dias * 86400000).toISOString().slice(0, 10);
    const sql = QUERY_RESUMEN.replace('$WHERE', 's.fecha_programada BETWEEN $1 AND $2');
    return this.dataSource.query(sql, [hoy, hasta]);
  }

  private async obtenerResumenSalida(salidaId: number): Promise<ResumenSalida | null> {
    const sql = QUERY_RESUMEN.replace('$WHERE', 's.id = $1');
    const rows: ResumenSalida[] = await this.dataSource.query(sql, [salidaId]);
    return rows[0] ?? null;
  }

  private async obtenerAdmin(): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { role: RolUsuario.ADMIN } });
  }
}
