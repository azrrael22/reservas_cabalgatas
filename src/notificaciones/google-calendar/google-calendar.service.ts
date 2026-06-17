import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import { ResumenSalida } from '../dto/resumen-salida.dto';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar: calendar_v3.Calendar | null = null;
  private calendarId: string;

  constructor(private readonly config: ConfigService) {
    this.calendarId = this.config.get<string>('GOOGLE_CALENDAR_ID', 'primary');
    const credentialsJson = this.config.get<string>('GOOGLE_CREDENTIALS_JSON');

    if (!credentialsJson) {
      this.logger.warn('GOOGLE_CREDENTIALS_JSON no configurado — Google Calendar desactivado');
      return;
    }

    try {
      const credentials = JSON.parse(credentialsJson);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
      this.calendar = google.calendar({ version: 'v3', auth });
    } catch (err) {
      this.logger.error(`Error al inicializar Google Calendar: ${err.message}`);
    }
  }

  async sincronizarSalidas(salidas: ResumenSalida[]): Promise<void> {
    if (!this.calendar) return;
    await Promise.allSettled(salidas.map((s) => this.sincronizarSalida(s)));
  }

  async sincronizarSalida(salida: ResumenSalida): Promise<void> {
    if (!this.calendar) return;

    try {
      const existente = await this.buscarEventoExistente(salida.id);

      const inicio = `${salida.fechaProgramada}T${salida.tiempoInicio}`;
      const fin = `${salida.fechaProgramada}T${salida.tiempoFin}`;

      const eventBody: calendar_v3.Schema$Event = {
        summary: `Salida: ${salida.rutaNombre}`,
        description: `Personas: ${salida.totalPersonas}\nRuta: ${salida.rutaNombre}\nEstado: ${salida.estado}`,
        start: { dateTime: inicio, timeZone: 'America/Bogota' },
        end: { dateTime: fin, timeZone: 'America/Bogota' },
        extendedProperties: {
          private: { salidaId: String(salida.id) },
        },
      };

      if (existente) {
        await this.calendar.events.patch({
          calendarId: this.calendarId,
          eventId: existente,
          requestBody: eventBody,
        });
      } else {
        await this.calendar.events.insert({
          calendarId: this.calendarId,
          requestBody: eventBody,
        });
      }
    } catch (err) {
      this.logger.error(`Error sincronizando salida #${salida.id} en Google Calendar: ${err.message}`);
    }
  }

  private async buscarEventoExistente(salidaId: number): Promise<string | null> {
    try {
      const res = await this.calendar!.events.list({
        calendarId: this.calendarId,
        privateExtendedProperty: [`salidaId=${salidaId}`],
        maxResults: 1,
      });
      const items = (res as { data: calendar_v3.Schema$Events }).data.items ?? [];
      return items.length > 0 ? (items[0].id ?? null) : null;
    } catch {
      return null;
    }
  }
}
