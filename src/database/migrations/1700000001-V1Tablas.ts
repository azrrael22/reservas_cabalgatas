import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

export class V1Tablas1700000000001 implements MigrationInterface {
  name = 'V1Tablas1700000000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = readFileSync(
      join(__dirname, '../../../db/migration/V1__TABLAS.sql'),
      'utf8',
    );
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS participantes CASCADE;
      DROP TABLE IF EXISTS reservaciones CASCADE;
      DROP TABLE IF EXISTS salida_guias CASCADE;
      DROP TABLE IF EXISTS salida_caballos CASCADE;
      DROP TABLE IF EXISTS salidas CASCADE;
      DROP TABLE IF EXISTS GUIAS CASCADE;
      DROP TABLE IF EXISTS CABALLOS CASCADE;
      DROP TABLE IF EXISTS RUTAS CASCADE;
      DROP TABLE IF EXISTS USUARIOS CASCADE;
    `);
  }
}
