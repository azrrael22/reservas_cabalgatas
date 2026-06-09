export class RecursoNoEncontradoException extends Error {
  constructor(recurso: string, id: number | string) {
    super(`${recurso} con id ${id} no encontrado`);
    this.name = 'RecursoNoEncontradoException';
  }
}
