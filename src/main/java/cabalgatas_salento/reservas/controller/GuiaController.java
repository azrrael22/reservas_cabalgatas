package cabalgatas_salento.reservas.controller;

import cabalgatas_salento.reservas.dto.request.GuiaRequest;
import cabalgatas_salento.reservas.dto.response.GuiaResponse;
import cabalgatas_salento.reservas.service.GuiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/guias")
@RequiredArgsConstructor
public class GuiaController {

    private final GuiaService guiaService;

    @GetMapping
    public List<GuiaResponse> listar() {
        return guiaService.listar();
    }

    @GetMapping("/{id}")
    public GuiaResponse obtener(@PathVariable Long id) {
        return guiaService.obtener(id);
    }

    @PostMapping
    public ResponseEntity<GuiaResponse> crear(@Valid @RequestBody GuiaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(guiaService.crear(request));
    }

    @PutMapping("/{id}")
    public GuiaResponse actualizar(@PathVariable Long id, @Valid @RequestBody GuiaRequest request) {
        return guiaService.actualizar(id, request);
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        guiaService.activar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        guiaService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        guiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
