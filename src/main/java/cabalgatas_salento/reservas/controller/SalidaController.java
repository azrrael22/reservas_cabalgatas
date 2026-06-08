package cabalgatas_salento.reservas.controller;

import cabalgatas_salento.reservas.dto.response.SalidaResponse;
import cabalgatas_salento.reservas.service.SalidaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salidas")
@RequiredArgsConstructor
public class SalidaController {

    private final SalidaService salidaService;

    @GetMapping
    public List<SalidaResponse> listar() {
        return salidaService.listar();
    }

    @GetMapping("/{id}")
    public SalidaResponse obtener(@PathVariable Long id) {
        return salidaService.obtener(id);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        salidaService.cancelar(id);
        return ResponseEntity.noContent().build();
    }
}
