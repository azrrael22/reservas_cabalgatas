package cabalgatas_salento.reservas.controller;

import cabalgatas_salento.reservas.dto.request.CaballoRequest;
import cabalgatas_salento.reservas.dto.response.CaballoResponse;
import cabalgatas_salento.reservas.service.CaballoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/caballos")
@RequiredArgsConstructor
public class CaballoController {

    private final CaballoService caballoService;

    @GetMapping
    public List<CaballoResponse> listar() {
        return caballoService.listar();
    }

    @GetMapping("/{id}")
    public CaballoResponse obtener(@PathVariable Long id) {
        return caballoService.obtener(id);
    }

    @PostMapping
    public ResponseEntity<CaballoResponse> crear(@Valid @RequestBody CaballoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(caballoService.crear(request));
    }

    @PutMapping("/{id}")
    public CaballoResponse actualizar(@PathVariable Long id, @Valid @RequestBody CaballoRequest request) {
        return caballoService.actualizar(id, request);
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        caballoService.activar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        caballoService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        caballoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
