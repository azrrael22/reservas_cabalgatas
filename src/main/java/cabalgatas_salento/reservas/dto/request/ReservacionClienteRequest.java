package cabalgatas_salento.reservas.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ReservacionClienteRequest {

    @NotNull(message = "La ruta es requerida")
    private Long rutaId;

    @NotNull(message = "La fecha programada es requerida")
    @Future(message = "La fecha programada debe ser en el futuro")
    private LocalDate fechaProgramada;

    @NotNull(message = "La hora de inicio es requerida")
    private LocalTime tiempoInicio;

    @NotNull(message = "El número de personas es requerido")
    @Positive(message = "El número de personas debe ser positivo")
    private Integer numPeople;

    @NotNull(message = "Los participantes son requeridos")
    @Size(min = 1, message = "Debe haber al menos un participante")
    @Valid
    private List<ParticipanteRequest> participantes;
}
