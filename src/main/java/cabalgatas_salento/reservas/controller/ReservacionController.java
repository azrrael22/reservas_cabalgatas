package cabalgatas_salento.reservas.controller;

import cabalgatas_salento.reservas.dto.request.ReservacionAdminRequest;
import cabalgatas_salento.reservas.dto.request.ReservacionClienteRequest;
import cabalgatas_salento.reservas.dto.request.ReservacionUpdateRequest;
import cabalgatas_salento.reservas.dto.response.ReservacionResponse;
import cabalgatas_salento.reservas.entity.Usuario;
import cabalgatas_salento.reservas.service.ReservacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReservacionController {

    private final ReservacionService reservacionService;

    /** Admin crea una reservación a nombre de un cliente. */
    @PostMapping("/admin/reservaciones")
    public ResponseEntity<ReservacionResponse> crearComoAdmin(
            @Valid @RequestBody ReservacionAdminRequest request,
            @AuthenticationPrincipal Usuario admin) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservacionService.crearComoAdmin(request, admin.getId()));
    }

    /** Cliente crea su propia reservación. */
    @PostMapping("/reservaciones")
    public ResponseEntity<ReservacionResponse> crearComoCliente(
            @Valid @RequestBody ReservacionClienteRequest request,
            @AuthenticationPrincipal Usuario cliente) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservacionService.crearComoCliente(request, cliente.getId()));
    }

    /** Cliente modifica su reservación (num_people y participantes). */
    @PutMapping("/reservaciones/{id}")
    public ReservacionResponse actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ReservacionUpdateRequest request,
            @AuthenticationPrincipal Usuario cliente) {
        return reservacionService.actualizar(id, request, cliente.getId());
    }

    /** Cliente cancela su reservación. */
    @PatchMapping("/reservaciones/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario cliente) {
        reservacionService.cancelar(id, cliente.getId());
        return ResponseEntity.noContent().build();
    }

    /** Lista las reservaciones del cliente autenticado. */
    @GetMapping("/reservaciones/mis-reservas")
    public List<ReservacionResponse> misReservas(@AuthenticationPrincipal Usuario cliente) {
        return reservacionService.misReservaciones(cliente.getId());
    }

    /** Detalle de una reservación (cliente ve la suya, admin ve cualquiera). */
    @GetMapping("/reservaciones/{id}")
    public ReservacionResponse obtener(@PathVariable Long id) {
        return reservacionService.obtener(id);
    }
}
