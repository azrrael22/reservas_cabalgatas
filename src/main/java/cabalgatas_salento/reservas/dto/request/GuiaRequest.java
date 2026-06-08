package cabalgatas_salento.reservas.dto.request;

import cabalgatas_salento.reservas.entity.enums.TipoDocumento;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GuiaRequest {

    @NotBlank(message = "El primer nombre es requerido")
    private String primerNombre;

    @NotBlank(message = "El primer apellido es requerido")
    private String primerApellido;

    @NotNull(message = "El tipo de documento es requerido")
    private TipoDocumento tipoDocumento;

    @NotNull(message = "La fecha de nacimiento es requerida")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El documento es requerido")
    private String documento;

    @Pattern(regexp = "^\\+\\d{7,15}$", message = "El teléfono debe incluir indicativo internacional")
    private String telefono;

    @Email(message = "Formato de email inválido")
    private String email;
}
