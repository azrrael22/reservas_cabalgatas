-- Borrado lógico permanente para caballos, guías y rutas.
-- eliminado=true significa que el registro fue eliminado y no puede reactivarse.

ALTER TABLE CABALLOS ADD COLUMN eliminado BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE GUIAS    ADD COLUMN eliminado BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE RUTAS    ADD COLUMN eliminado BOOLEAN NOT NULL DEFAULT false;
