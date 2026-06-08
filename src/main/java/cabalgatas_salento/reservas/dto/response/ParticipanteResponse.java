package cabalgatas_salento.reservas.dto.response;

import cabalgatas_salento.reservas.entity.enums.TipoDocumento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipanteResponse {
    private Long id;
    private String primerNombre;
    private String primerApellido;
    private TipoDocumento tipoDocumento;
    private String documento;
    private LocalDate fechaNacimiento;
    private Short alturaCm;
    private BigDecimal pesoKg;
}
