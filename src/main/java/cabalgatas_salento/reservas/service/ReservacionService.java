package cabalgatas_salento.reservas.service;

import cabalgatas_salento.reservas.dto.request.ReservacionAdminRequest;
import cabalgatas_salento.reservas.dto.request.ReservacionClienteRequest;
import cabalgatas_salento.reservas.dto.request.ReservacionUpdateRequest;
import cabalgatas_salento.reservas.dto.response.ReservacionResponse;

import java.util.List;

public interface ReservacionService {
    ReservacionResponse crearComoAdmin(ReservacionAdminRequest request, Long adminId);
    ReservacionResponse crearComoCliente(ReservacionClienteRequest request, Long clienteId);
    ReservacionResponse actualizar(Long id, ReservacionUpdateRequest request, Long clienteId);
    void cancelar(Long id, Long clienteId);
    ReservacionResponse obtener(Long id);
    List<ReservacionResponse> misReservaciones(Long clienteId);
}
