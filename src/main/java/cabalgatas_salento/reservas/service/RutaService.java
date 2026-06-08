package cabalgatas_salento.reservas.service;

import cabalgatas_salento.reservas.dto.request.RutaRequest;
import cabalgatas_salento.reservas.dto.response.RutaResponse;

import java.util.List;

public interface RutaService {
    List<RutaResponse> listar();
    RutaResponse obtener(Long id);
    RutaResponse crear(RutaRequest request);
    RutaResponse actualizar(Long id, RutaRequest request);
    void activar(Long id);
    void desactivar(Long id);
    void eliminar(Long id);
}
