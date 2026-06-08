package cabalgatas_salento.reservas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaballoResponse {
    private Long id;
    private String nombre;
    private String raza;
    private Boolean isActive;
    private Boolean eliminado;
}
