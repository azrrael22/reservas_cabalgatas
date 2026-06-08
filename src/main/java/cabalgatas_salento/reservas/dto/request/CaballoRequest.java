package cabalgatas_salento.reservas.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CaballoRequest {

    @NotBlank(message = "El nombre es requerido")
    private String nombre;

    @NotBlank(message = "La raza es requerida")
    private String raza;
}
