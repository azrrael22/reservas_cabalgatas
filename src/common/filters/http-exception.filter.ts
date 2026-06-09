import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RecursoNoEncontradoException } from '../exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../exceptions/regla-negocio.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof RecursoNoEncontradoException) {
      response.status(HttpStatus.NOT_FOUND).json({
        type: 'about:blank',
        title: 'Recurso no encontrado',
        status: HttpStatus.NOT_FOUND,
        detail: exception.message,
      });
      return;
    }

    if (exception instanceof ReglaNegocioException) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        type: 'about:blank',
        title: 'Regla de negocio violada',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        detail: exception.message,
      });
      return;
    }

    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;
      const errores: Record<string, string> = {};

      if (Array.isArray(res?.message)) {
        for (const msg of res.message) {
          const parts = msg.split(' ');
          const field = parts[0];
          errores[field] = msg;
        }
      }

      // class-validator provides structured constraints
      if (res?.message && typeof res.message === 'object' && !Array.isArray(res.message)) {
        Object.assign(errores, res.message);
      }

      response.status(HttpStatus.BAD_REQUEST).json({
        type: 'about:blank',
        title: 'Error de validación',
        status: HttpStatus.BAD_REQUEST,
        detail: 'Los datos enviados no son válidos',
        errores: Object.keys(errores).length > 0 ? errores : res?.message,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse() as any;
      response.status(status).json({
        type: 'about:blank',
        title: exception.message,
        status,
        detail: typeof res === 'string' ? res : res?.message ?? exception.message,
      });
      return;
    }

    console.error('Error no controlado:', exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      type: 'about:blank',
      title: 'Error interno del servidor',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      detail: 'Ocurrió un error inesperado',
    });
  }
}
