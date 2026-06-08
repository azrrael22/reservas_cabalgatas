package cabalgatas_salento.reservas.dto.response;

import cabalgatas_salento.reservas.entity.enums.EstadoReservacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservacionResponse {
    private Long id;
    private SalidaResponse salida;
    private Long clienteId;
    private String clienteNombre;
    private Long adminId;
    private Integer numPeople;
    private BigDecimal precioUnitario;
    private BigDecimal total;
    private EstadoReservacion estado;
    private List<ParticipanteResponse> participantes;
}
