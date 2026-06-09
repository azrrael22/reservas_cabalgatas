import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

export class V3Eliminado1700000000003 implements MigrationInterface {
  name = 'V3Eliminado1700000000003';

  async up(queryRunner: QueryRunner): Promise<void> {
    const sql = readFileSync(
      join(__dirname, '../../../db/migration/V3__ADD_ELIMINADO.sql'),
      'utf8',
    );
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE CABALLOS DROP COLUMN IF EXISTS eliminado;
      ALTER TABLE GUIAS DROP COLUMN IF EXISTS eliminado;
      ALTER TABLE RUTAS DROP COLUMN IF EXISTS eliminado;
    `);
  }
}
