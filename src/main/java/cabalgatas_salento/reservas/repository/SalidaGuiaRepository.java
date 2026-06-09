package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.SalidaGuia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalidaGuiaRepository extends JpaRepository<SalidaGuia, Long> {
    int countBySalidaId(Long salidaId);
}
