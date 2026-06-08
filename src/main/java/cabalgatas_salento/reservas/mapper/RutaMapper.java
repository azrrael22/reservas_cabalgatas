package cabalgatas_salento.reservas.mapper;

import cabalgatas_salento.reservas.dto.request.RutaRequest;
import cabalgatas_salento.reservas.dto.response.RutaResponse;
import cabalgatas_salento.reservas.entity.Ruta;
import org.springframework.stereotype.Component;

@Component
public class RutaMapper {

    public RutaResponse toResponse(Ruta ruta) {
        return RutaResponse.builder()
                .id(ruta.getId())
                .nombre(ruta.getNombre())
                .descripcion(ruta.getDescripcion())
                .precio(ruta.getPrecio())
                .dificultad(ruta.getDificultad())
                .duracionMinutos(ruta.getDuracionMinutos())
                .imageUrl(ruta.getImageUrl())
                .isActive(ruta.getIsActive())
                .eliminado(ruta.getEliminado())
                .build();
    }

    public Ruta toEntity(RutaRequest request) {
        return Ruta.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .dificultad(request.getDificultad())
                .duracionMinutos(request.getDuracionMinutos())
                .imageUrl(request.getImageUrl())
                .build();
    }
}
