package cabalgatas_salento.reservas.service;

import cabalgatas_salento.reservas.dto.response.SalidaResponse;

import java.util.List;

public interface SalidaService {
    List<SalidaResponse> listar();
    SalidaResponse obtener(Long id);
    void cancelar(Long id);
}
