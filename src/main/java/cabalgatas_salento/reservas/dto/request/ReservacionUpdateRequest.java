package cabalgatas_salento.reservas.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class ReservacionUpdateRequest {

    @NotNull(message = "El número de personas es requerido")
    @Positive(message = "El número de personas debe ser positivo")
    private Integer numPeople;

    @NotNull(message = "Los participantes son requeridos")
    @Size(min = 1, message = "Debe haber al menos un participante")
    @Valid
    private List<ParticipanteRequest> participantes;
}
