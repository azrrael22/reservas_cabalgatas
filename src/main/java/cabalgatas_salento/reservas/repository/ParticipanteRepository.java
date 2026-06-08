package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.Participante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    List<Participante> findByReservacionId(Long reservacionId);
    void deleteByReservacionId(Long reservacionId);
}
