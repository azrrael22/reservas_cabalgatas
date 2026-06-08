package cabalgatas_salento.reservas.service.impl;

import cabalgatas_salento.reservas.dto.response.SalidaResponse;
import cabalgatas_salento.reservas.entity.Salida;
import cabalgatas_salento.reservas.entity.enums.EstadoReservacion;
import cabalgatas_salento.reservas.entity.enums.EstadoSalida;
import cabalgatas_salento.reservas.exception.RecursoNoEncontradoException;
import cabalgatas_salento.reservas.exception.ReglaNegocioException;
import cabalgatas_salento.reservas.mapper.SalidaMapper;
import cabalgatas_salento.reservas.repository.ReservacionRepository;
import cabalgatas_salento.reservas.repository.SalidaRepository;
import cabalgatas_salento.reservas.service.SalidaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalidaServiceImpl implements SalidaService {

    private final SalidaRepository salidaRepository;
    private final ReservacionRepository reservacionRepository;
    private final SalidaMapper salidaMapper;

    @Override
    public List<SalidaResponse> listar() {
        return salidaRepository.findAll()
                .stream().map(salidaMapper::toResponse).toList();
    }

    @Override
    public SalidaResponse obtener(Long id) {
        return salidaMapper.toResponse(buscar(id));
    }

    @Override
    @Transactional
    public void cancelar(Long id) {
        Salida salida = buscar(id);
        if (salida.getEstado() == EstadoSalida.COMPLETADO) {
            throw new ReglaNegocioException("No se puede cancelar una salida ya completada.");
        }
        if (salida.getEstado() == EstadoSalida.CANCELADO) {
            throw new ReglaNegocioException("La salida ya está cancelada.");
        }
        salida.setEstado(EstadoSalida.CANCELADO);
        salidaRepository.save(salida);

        // Cancelar todas las reservaciones activas de esta salida
        reservacionRepository.findBySalidaId(id).forEach(r -> {
            if (r.getEstado() != EstadoReservacion.CANCELADO && r.getEstado() != EstadoReservacion.COMPLETADO) {
                r.setEstado(EstadoReservacion.CANCELADO);
                reservacionRepository.save(r);
            }
        });
    }

    private Salida buscar(Long id) {
        return salidaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Salida no encontrada con id: " + id));
    }
}
