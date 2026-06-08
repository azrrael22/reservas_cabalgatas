package cabalgatas_salento.reservas.service;

import cabalgatas_salento.reservas.dto.request.GuiaRequest;
import cabalgatas_salento.reservas.dto.response.GuiaResponse;

import java.util.List;

public interface GuiaService {
    List<GuiaResponse> listar();
    GuiaResponse obtener(Long id);
    GuiaResponse crear(GuiaRequest request);
    GuiaResponse actualizar(Long id, GuiaRequest request);
    void activar(Long id);
    void desactivar(Long id);
    void eliminar(Long id);
}
