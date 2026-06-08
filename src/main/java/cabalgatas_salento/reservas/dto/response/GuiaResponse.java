package cabalgatas_salento.reservas.dto.response;

import cabalgatas_salento.reservas.entity.enums.TipoDocumento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuiaResponse {
    private Long id;
    private String primerNombre;
    private String primerApellido;
    private TipoDocumento tipoDocumento;
    private LocalDate fechaNacimiento;
    private String documento;
    private String telefono;
    private String email;
    private Boolean isActive;
    private Boolean eliminado;
}
