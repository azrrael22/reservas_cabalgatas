package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RutaRepository extends JpaRepository<Ruta, Long> {
    List<Ruta> findByEliminadoFalse();
    List<Ruta> findByIsActiveTrueAndEliminadoFalse();
}
