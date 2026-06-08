package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.Reservacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservacionRepository extends JpaRepository<Reservacion, Long> {

    List<Reservacion> findByClienteId(Long clienteId);

    List<Reservacion> findBySalidaId(Long salidaId);

    @Query(nativeQuery = true, value = """
            SELECT COALESCE(SUM(num_people), 0)
            FROM reservaciones
            WHERE salida_id = :salidaId AND estado != 'cancelado'
            """)
    int sumarPersonasPorSalida(@Param("salidaId") Long salidaId);
}
