package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.Guia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface GuiaRepository extends JpaRepository<Guia, Long> {

    List<Guia> findByEliminadoFalse();

    List<Guia> findByIsActiveTrueAndEliminadoFalse();

    /**
     * Primer guía activo que no está asignado a otra salida con conflicto de horario,
     * ni ya asignado a la salida actual.
     */
    @Query(nativeQuery = true, value = """
            SELECT g.* FROM guias g
            WHERE g.is_active = true AND g.eliminado = false
            AND g.id NOT IN (
                SELECT sg.guia_id FROM salida_guias sg WHERE sg.salida_id = :salidaId
            )
            AND g.id NOT IN (
                SELECT sg2.guia_id FROM salida_guias sg2
                INNER JOIN salidas s ON sg2.salida_id = s.id
                WHERE s.id != :salidaId
                AND s.fecha_programada = :fecha
                AND s.tiempo_inicio < :fin
                AND s.tiempo_fin > :inicio
                AND s.estado != 'cancelado'
            )
            LIMIT 1
            """)
    Optional<Guia> findPrimerDisponible(
            @Param("salidaId") Long salidaId,
            @Param("fecha") LocalDate fecha,
            @Param("inicio") LocalTime inicio,
            @Param("fin") LocalTime fin
    );
}
