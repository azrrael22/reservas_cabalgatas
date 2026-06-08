package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.SalidaCaballo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalidaCaballoRepository extends JpaRepository<SalidaCaballo, Long> {
    int countBySalidaId(Long salidaId);
}
