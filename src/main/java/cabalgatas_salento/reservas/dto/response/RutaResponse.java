package cabalgatas_salento.reservas.dto.response;

import cabalgatas_salento.reservas.entity.enums.DificultadRuta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RutaResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private DificultadRuta dificultad;
    private Integer duracionMinutos;
    private String imageUrl;
    private Boolean isActive;
    private Boolean eliminado;
}
