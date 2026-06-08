package cabalgatas_salento.reservas.mapper;

import cabalgatas_salento.reservas.dto.request.ParticipanteRequest;
import cabalgatas_salento.reservas.dto.response.ParticipanteResponse;
import cabalgatas_salento.reservas.entity.Participante;
import org.springframework.stereotype.Component;

@Component
public class ParticipanteMapper {

    public ParticipanteResponse toResponse(Participante p) {
        return ParticipanteResponse.builder()
                .id(p.getId())
                .primerNombre(p.getPrimerNombre())
                .primerApellido(p.getPrimerApellido())
                .tipoDocumento(p.getTipoDocumento())
                .documento(p.getDocumento())
                .fechaNacimiento(p.getFechaNacimiento())
                .alturaCm(p.getAlturaCm())
                .pesoKg(p.getPesoKg())
                .build();
    }

    public Participante toEntity(ParticipanteRequest request) {
        return Participante.builder()
                .primerNombre(request.getPrimerNombre())
                .primerApellido(request.getPrimerApellido())
                .tipoDocumento(request.getTipoDocumento())
                .documento(request.getDocumento())
                .fechaNacimiento(request.getFechaNacimiento())
                .alturaCm(request.getAlturaCm())
                .pesoKg(request.getPesoKg())
                .build();
    }
}
