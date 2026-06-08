package cabalgatas_salento.reservas.controller;

import cabalgatas_salento.reservas.dto.request.RutaRequest;
import cabalgatas_salento.reservas.dto.response.RutaResponse;
import cabalgatas_salento.reservas.service.RutaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rutas")
@RequiredArgsConstructor
public class RutaController {

    private final RutaService rutaService;

    @GetMapping
    public List<RutaResponse> listar() {
        return rutaService.listar();
    }

    @GetMapping("/{id}")
    public RutaResponse obtener(@PathVariable Long id) {
        return rutaService.obtener(id);
    }

    @PostMapping
    public ResponseEntity<RutaResponse> crear(@Valid @RequestBody RutaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rutaService.crear(request));
    }

    @PutMapping("/{id}")
    public RutaResponse actualizar(@PathVariable Long id, @Valid @RequestBody RutaRequest request) {
        return rutaService.actualizar(id, request);
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        rutaService.activar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        rutaService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        rutaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
