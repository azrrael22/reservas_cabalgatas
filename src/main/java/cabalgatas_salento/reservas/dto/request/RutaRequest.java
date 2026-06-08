package cabalgatas_salento.reservas.dto.request;

import cabalgatas_salento.reservas.entity.enums.DificultadRuta;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RutaRequest {

    @NotBlank(message = "El nombre es requerido")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio es requerido")
    @PositiveOrZero(message = "El precio no puede ser negativo")
    private BigDecimal precio;

    @NotNull(message = "La dificultad es requerida")
    private DificultadRuta dificultad;

    @NotNull(message = "La duración es requerida")
    @Positive(message = "La duración debe ser mayor a 0")
    private Integer duracionMinutos;

    private String imageUrl;
}
