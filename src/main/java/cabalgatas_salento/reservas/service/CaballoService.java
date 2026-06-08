package cabalgatas_salento.reservas.service;

import cabalgatas_salento.reservas.dto.request.CaballoRequest;
import cabalgatas_salento.reservas.dto.response.CaballoResponse;

import java.util.List;

public interface CaballoService {
    List<CaballoResponse> listar();
    CaballoResponse obtener(Long id);
    CaballoResponse crear(CaballoRequest request);
    CaballoResponse actualizar(Long id, CaballoRequest request);
    void activar(Long id);
    void desactivar(Long id);
    void eliminar(Long id);
}
