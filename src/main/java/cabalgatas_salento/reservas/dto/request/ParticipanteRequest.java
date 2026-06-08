package cabalgatas_salento.reservas.dto.request;

import cabalgatas_salento.reservas.entity.enums.TipoDocumento;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ParticipanteRequest {

    @NotBlank(message = "El primer nombre es requerido")
    private String primerNombre;

    @NotBlank(message = "El primer apellido es requerido")
    private String primerApellido;

    @NotNull(message = "El tipo de documento es requerido")
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "El documento es requerido")
    private String documento;

    @NotNull(message = "La fecha de nacimiento es requerida")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;

    @NotNull(message = "La altura es requerida")
    @Positive(message = "La altura debe ser positiva")
    private Short alturaCm;

    @NotNull(message = "El peso es requerido")
    @Positive(message = "El peso debe ser positivo")
    private BigDecimal pesoKg;
}
