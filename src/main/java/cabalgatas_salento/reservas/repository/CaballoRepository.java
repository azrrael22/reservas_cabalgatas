package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.Caballo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CaballoRepository extends JpaRepository<Caballo, Long> {

    List<Caballo> findByEliminadoFalse();

    List<Caballo> findByIsActiveTrueAndEliminadoFalse();

    /**
     * Caballos activos que no están asignados a otra salida con conflicto de horario,
     * ni ya asignados a la salida actual.
     */
    @Query(nativeQuery = true, value = """
            SELECT c.* FROM caballos c
            WHERE c.is_active = true AND c.eliminado = false
            AND c.id NOT IN (
                SELECT sc.horse_id FROM salida_caballos sc WHERE sc.salida_id = :salidaId
            )
            AND c.id NOT IN (
                SELECT sc2.horse_id FROM salida_caballos sc2
                INNER JOIN salidas s ON sc2.salida_id = s.id
                WHERE s.id != :salidaId
                AND s.fecha_programada = :fecha
                AND s.tiempo_inicio < :fin
                AND s.tiempo_fin > :inicio
                AND s.estado != 'cancelado'
            )
            LIMIT :cantidad
            """)
    List<Caballo> findDisponibles(
            @Param("salidaId") Long salidaId,
            @Param("fecha") LocalDate fecha,
            @Param("inicio") LocalTime inicio,
            @Param("fin") LocalTime fin,
            @Param("cantidad") int cantidad
    );
}
