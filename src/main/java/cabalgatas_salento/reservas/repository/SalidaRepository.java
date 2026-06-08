package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.Salida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

public interface SalidaRepository extends JpaRepository<Salida, Long> {

    @Query(nativeQuery = true, value = """
            SELECT * FROM salidas
            WHERE ruta_id = :rutaId
            AND fecha_programada = :fecha
            AND tiempo_inicio = :tiempoInicio
            AND estado = 'programado'
            LIMIT 1
            """)
    Optional<Salida> findSalidaProgramada(
            @Param("rutaId") Long rutaId,
            @Param("fecha") LocalDate fecha,
            @Param("tiempoInicio") LocalTime tiempoInicio
    );
}
