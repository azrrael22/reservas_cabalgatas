import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Reservacion } from '../reservaciones/entities/reservacion.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ResumenSalida } from '../notificaciones/dto/resumen-salida.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async notificarCancelacionReservacion(reservacion: Reservacion): Promise<void> {
    if (!reservacion.cliente?.email) return;

    const { id, cliente, salida, numPeople, total } = reservacion;
    const nombre = `${cliente.primerNombre} ${cliente.primerApellido}`;
    const fecha = salida.fechaProgramada;
    const hora = salida.tiempoInicio;
    const ruta = salida.ruta?.nombre ?? 'N/A';

    try {
      await this.mailerService.sendMail({
        to: cliente.email,
        subject: `Tu reservación #${id} ha sido cancelada – Cabalgatas Salento`,
        html: this.plantillaCancelacionReservacion({ nombre, id, ruta, fecha, hora, numPeople, total }),
      });
    } catch (err) {
      this.logger.error(`Error al enviar correo de cancelación de reservación #${id}: ${err.message}`);
    }
  }

  async notificarCancelacionSalidaAClientes(
    reservaciones: Reservacion[],
    salida: Salida,
  ): Promise<void> {
    const clientesNotificados = new Set<string>();
    const fecha = salida.fechaProgramada;
    const hora = salida.tiempoInicio;
    const ruta = salida.ruta?.nombre ?? 'N/A';

    for (const reservacion of reservaciones) {
      const email = reservacion.cliente?.email;
      if (!email || clientesNotificados.has(email)) continue;
      clientesNotificados.add(email);

      const nombre = `${reservacion.cliente.primerNombre} ${reservacion.cliente.primerApellido}`;

      try {
        await this.mailerService.sendMail({
          to: email,
          subject: `Tu cabalgata del ${fecha} ha sido cancelada – Cabalgatas Salento`,
          html: this.plantillaCancelacionSalida({ nombre, ruta, fecha, hora, numPeople: reservacion.numPeople }),
        });
      } catch (err) {
        this.logger.error(`Error al enviar correo de cancelación de salida a ${email}: ${err.message}`);
      }
    }
  }

  async notificarResumenAdmin(
    admin: Usuario,
    salidas: ResumenSalida[],
    dias: number,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: admin.email,
        subject: `Resumen de salidas — próximos ${dias} días | Cabalgatas Salento`,
        html: this.plantillaResumenAdmin(salidas, dias),
      });
    } catch (err) {
      this.logger.error(`Error al enviar resumen al admin: ${err.message}`);
    }
  }

  async notificarCambioSalidaAdmin(admin: Usuario, salida: ResumenSalida): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: admin.email,
        subject: `Actualización de salida — ${salida.fechaProgramada} ${salida.rutaNombre} | Cabalgatas Salento`,
        html: this.plantillaCambioSalida(salida),
      });
    } catch (err) {
      this.logger.error(`Error al notificar cambio de salida #${salida.id} al admin: ${err.message}`);
    }
  }

  private plantillaResumenAdmin(salidas: ResumenSalida[], dias: number): string {
    const filas =
      salidas.length === 0
        ? `<tr><td colspan="5" style="padding:12px; text-align:center; color:#888;">Sin salidas programadas en este período</td></tr>`
        : salidas
            .map(
              (s) => `
            <tr>
              <td style="padding:8px; border:1px solid #ddd;">${s.fechaProgramada}</td>
              <td style="padding:8px; border:1px solid #ddd;">${s.tiempoInicio.slice(0, 5)}</td>
              <td style="padding:8px; border:1px solid #ddd;">${s.tiempoFin.slice(0, 5)}</td>
              <td style="padding:8px; border:1px solid #ddd;">${s.rutaNombre}</td>
              <td style="padding:8px; border:1px solid #ddd; text-align:center;">${s.totalPersonas}</td>
            </tr>`,
            )
            .join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Resumen de Salidas — Próximos ${dias} días</h2>
        <p>Este es el resumen de las salidas programadas para los próximos <strong>${dias} días</strong>:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background:#8B4513; color:#fff;">
              <th style="padding:8px; text-align:left;">Fecha</th>
              <th style="padding:8px; text-align:left;">Inicio</th>
              <th style="padding:8px; text-align:left;">Fin</th>
              <th style="padding:8px; text-align:left;">Ruta</th>
              <th style="padding:8px; text-align:center;">Personas</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
        <p style="color: #888; font-size: 12px;">Cabalgatas Salento – Salento, Quindío, Colombia</p>
      </div>
    `;
  }

  private plantillaCambioSalida(salida: ResumenSalida): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Actualización de Salida – Cabalgatas Salento</h2>
        <p>Se ha creado o actualizado una reservación en la siguiente salida:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Ruta</strong></td><td style="padding:8px; border:1px solid #ddd;">${salida.rutaNombre}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Fecha</strong></td><td style="padding:8px; border:1px solid #ddd;">${salida.fechaProgramada}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Hora inicio</strong></td><td style="padding:8px; border:1px solid #ddd;">${salida.tiempoInicio.slice(0, 5)}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Hora fin</strong></td><td style="padding:8px; border:1px solid #ddd;">${salida.tiempoFin.slice(0, 5)}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Total personas</strong></td><td style="padding:8px; border:1px solid #ddd;">${salida.totalPersonas}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Estado</strong></td><td style="padding:8px; border:1px solid #ddd;">${salida.estado}</td></tr>
        </table>
        <p style="color: #888; font-size: 12px;">Cabalgatas Salento – Salento, Quindío, Colombia</p>
      </div>
    `;
  }

  private plantillaCancelacionReservacion(datos: {
    nombre: string;
    id: number;
    ruta: string;
    fecha: string;
    hora: string;
    numPeople: number;
    total: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Reservación Cancelada – Cabalgatas Salento</h2>
        <p>Hola <strong>${datos.nombre}</strong>,</p>
        <p>Tu reservación ha sido cancelada. A continuación encontrarás el resumen:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Número de reservación</strong></td><td style="padding:8px; border:1px solid #ddd;">#${datos.id}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Ruta</strong></td><td style="padding:8px; border:1px solid #ddd;">${datos.ruta}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Fecha</strong></td><td style="padding:8px; border:1px solid #ddd;">${datos.fecha}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Hora</strong></td><td style="padding:8px; border:1px solid #ddd;">${datos.hora}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Personas</strong></td><td style="padding:8px; border:1px solid #ddd;">${datos.numPeople}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Total</strong></td><td style="padding:8px; border:1px solid #ddd;">$${datos.total}</td></tr>
        </table>
        <p>Si tienes alguna pregunta, contáctanos respondiendo este correo.</p>
        <p style="color: #888; font-size: 12px;">Cabalgatas Salento – Salento, Quindío, Colombia</p>
      </div>
    `;
  }

  private plantillaCancelacionSalida(datos: {
    nombre: string;
    ruta: string;
    fecha: string;
    hora: string;
    numPeople: number;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Cabalgata Cancelada – Cabalgatas Salento</h2>
        <p>Hola <strong>${datos.nombre}</strong>,</p>
        <p>Lamentamos informarte que la salida para tu cabalgata ha sido cancelada por el administrador. A continuación encontrarás los detalles:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Ruta</strong></td><td style="padding:8px; border:1px solid #ddd;">${datos.ruta}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Fecha</strong></td><td style="padding:8px; border:1px solid #ddd;">${datos.fecha}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Hora</strong></td><td style="padding:8px; border:1px solid #ddd;">${datos.hora}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Personas en tu reservación</strong></td><td style="padding:8px; border:1px solid #ddd;">${datos.numPeople}</td></tr>
        </table>
        <p>Disculpa los inconvenientes. Si deseas reprogramar tu visita, contáctanos respondiendo este correo.</p>
        <p style="color: #888; font-size: 12px;">Cabalgatas Salento – Salento, Quindío, Colombia</p>
      </div>
    `;
  }
}
