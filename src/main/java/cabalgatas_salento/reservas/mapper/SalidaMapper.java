package cabalgatas_salento.reservas.mapper;

import cabalgatas_salento.reservas.dto.response.SalidaResponse;
import cabalgatas_salento.reservas.entity.Salida;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SalidaMapper {

    private final RutaMapper rutaMapper;
    private final CaballoMapper caballoMapper;
    private final GuiaMapper guiaMapper;

    public SalidaResponse toResponse(Salida salida) {
        return SalidaResponse.builder()
                .id(salida.getId())
                .ruta(rutaMapper.toResponse(salida.getRuta()))
                .fechaProgramada(salida.getFechaProgramada())
                .tiempoInicio(salida.getTiempoInicio())
                .tiempoFin(salida.getTiempoFin())
                .estado(salida.getEstado())
                .caballos(salida.getCaballos().stream()
                        .map(sc -> caballoMapper.toResponse(sc.getCaballo()))
                        .toList())
                .guias(salida.getGuias().stream()
                        .map(sg -> guiaMapper.toResponse(sg.getGuia()))
                        .toList())
                .build();
    }
}
