package cabalgatas_salento.reservas.mapper;

import cabalgatas_salento.reservas.dto.request.CaballoRequest;
import cabalgatas_salento.reservas.dto.response.CaballoResponse;
import cabalgatas_salento.reservas.entity.Caballo;
import org.springframework.stereotype.Component;

@Component
public class CaballoMapper {

    public CaballoResponse toResponse(Caballo caballo) {
        return CaballoResponse.builder()
                .id(caballo.getId())
                .nombre(caballo.getNombre())
                .raza(caballo.getRaza())
                .isActive(caballo.getIsActive())
                .eliminado(caballo.getEliminado())
                .build();
    }

    public Caballo toEntity(CaballoRequest request) {
        return Caballo.builder()
                .nombre(request.getNombre())
                .raza(request.getRaza())
                .build();
    }
}
