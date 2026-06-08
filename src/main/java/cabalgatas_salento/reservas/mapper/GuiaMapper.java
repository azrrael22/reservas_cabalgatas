package cabalgatas_salento.reservas.mapper;

import cabalgatas_salento.reservas.dto.request.GuiaRequest;
import cabalgatas_salento.reservas.dto.response.GuiaResponse;
import cabalgatas_salento.reservas.entity.Guia;
import org.springframework.stereotype.Component;

@Component
public class GuiaMapper {

    public GuiaResponse toResponse(Guia guia) {
        return GuiaResponse.builder()
                .id(guia.getId())
                .primerNombre(guia.getPrimerNombre())
                .primerApellido(guia.getPrimerApellido())
                .tipoDocumento(guia.getTipoDocumento())
                .fechaNacimiento(guia.getFechaNacimiento())
                .documento(guia.getDocumento())
                .telefono(guia.getTelefono())
                .email(guia.getEmail())
                .isActive(guia.getIsActive())
                .eliminado(guia.getEliminado())
                .build();
    }

    public Guia toEntity(GuiaRequest request) {
        return Guia.builder()
                .primerNombre(request.getPrimerNombre())
                .primerApellido(request.getPrimerApellido())
                .tipoDocumento(request.getTipoDocumento())
                .fechaNacimiento(request.getFechaNacimiento())
                .documento(request.getDocumento())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .build();
    }
}
