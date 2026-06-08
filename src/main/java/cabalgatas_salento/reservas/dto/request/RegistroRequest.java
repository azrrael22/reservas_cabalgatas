package cabalgatas_salento.reservas.dto.request;

import cabalgatas_salento.reservas.entity.enums.TipoDocumento;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegistroRequest {

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

    @NotBlank(message = "El email es requerido")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @NotBlank(message = "El teléfono es requerido")
    @Pattern(regexp = "^\\+\\d{7,15}$", message = "El teléfono debe incluir indicativo internacional (ej: +571234567890)")
    private String telefono;
}
