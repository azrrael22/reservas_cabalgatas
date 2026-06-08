package cabalgatas_salento.reservas.mapper;

import cabalgatas_salento.reservas.dto.response.ReservacionResponse;
import cabalgatas_salento.reservas.entity.Reservacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservacionMapper {

    private final SalidaMapper salidaMapper;
    private final ParticipanteMapper participanteMapper;

    public ReservacionResponse toResponse(Reservacion r) {
        return ReservacionResponse.builder()
                .id(r.getId())
                .salida(salidaMapper.toResponse(r.getSalida()))
                .clienteId(r.getCliente() != null ? r.getCliente().getId() : null)
                .clienteNombre(r.getCliente() != null
                        ? r.getCliente().getPrimerNombre() + " " + r.getCliente().getPrimerApellido()
                        : null)
                .adminId(r.getAdmin() != null ? r.getAdmin().getId() : null)
                .numPeople(r.getNumPeople())
                .precioUnitario(r.getPrecioUnitario())
                .total(r.getTotal())
                .estado(r.getEstado())
                .participantes(r.getParticipantes().stream()
                        .map(participanteMapper::toResponse)
                        .toList())
                .build();
    }
}
