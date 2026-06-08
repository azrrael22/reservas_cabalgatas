package cabalgatas_salento.reservas.dto.response;

import cabalgatas_salento.reservas.entity.enums.EstadoSalida;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalidaResponse {
    private Long id;
    private RutaResponse ruta;
    private LocalDate fechaProgramada;
    private LocalTime tiempoInicio;
    private LocalTime tiempoFin;
    private EstadoSalida estado;
    private List<CaballoResponse> caballos;
    private List<GuiaResponse> guias;
}
