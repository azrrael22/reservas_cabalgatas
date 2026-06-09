import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

export class V2Datos1700000000002 implements MigrationInterface {
  name = 'V2Datos1700000000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = readFileSync(
      join(__dirname, '../../../db/migration/V2__DATOS_PRUEBA.sql'),
      'utf8',
    );
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM CABALLOS;
      DELETE FROM GUIAS;
      DELETE FROM RUTAS;
    `);
  }
}
