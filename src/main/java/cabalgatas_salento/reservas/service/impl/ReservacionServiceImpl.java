package cabalgatas_salento.reservas.service.impl;

import cabalgatas_salento.reservas.dto.request.ParticipanteRequest;
import cabalgatas_salento.reservas.dto.request.ReservacionAdminRequest;
import cabalgatas_salento.reservas.dto.request.ReservacionClienteRequest;
import cabalgatas_salento.reservas.dto.request.ReservacionUpdateRequest;
import cabalgatas_salento.reservas.dto.response.ReservacionResponse;
import cabalgatas_salento.reservas.entity.*;
import cabalgatas_salento.reservas.entity.enums.EstadoReservacion;
import cabalgatas_salento.reservas.entity.enums.EstadoSalida;
import cabalgatas_salento.reservas.exception.RecursoNoEncontradoException;
import cabalgatas_salento.reservas.exception.ReglaNegocioException;
import cabalgatas_salento.reservas.mapper.ParticipanteMapper;
import cabalgatas_salento.reservas.mapper.ReservacionMapper;
import cabalgatas_salento.reservas.repository.*;
import cabalgatas_salento.reservas.service.ReservacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservacionServiceImpl implements ReservacionService {

    private final ReservacionRepository reservacionRepository;
    private final SalidaRepository salidaRepository;
    private final RutaRepository rutaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CaballoRepository caballoRepository;
    private final GuiaRepository guiaRepository;
    private final SalidaCaballoRepository salidaCaballoRepository;
    private final SalidaGuiaRepository salidaGuiaRepository;
    private final ParticipanteRepository participanteRepository;
    private final ReservacionMapper reservacionMapper;
    private final ParticipanteMapper participanteMapper;

    @Override
    @Transactional
    public ReservacionResponse crearComoAdmin(ReservacionAdminRequest req, Long adminId) {
        Usuario admin = buscarUsuario(adminId);
        validarParticipantes(req.getNumPeople(), req.getParticipantes());
        Ruta ruta = buscarRuta(req.getRutaId());
        Salida salida = obtenerOCrearSalida(ruta, req.getFechaProgramada(), req.getTiempoInicio());
        Reservacion reservacion = crearReservacion(salida, ruta, req.getNumPeople(), req.getParticipantes(), null, admin);
        asignarRecursos(salida);
        return reservacionMapper.toResponse(reservacion);
    }

    @Override
    @Transactional
    public ReservacionResponse crearComoCliente(ReservacionClienteRequest req, Long clienteId) {
        Usuario cliente = buscarUsuario(clienteId);
        validarParticipantes(req.getNumPeople(), req.getParticipantes());
        Ruta ruta = buscarRuta(req.getRutaId());
        Salida salida = obtenerOCrearSalida(ruta, req.getFechaProgramada(), req.getTiempoInicio());
        Reservacion reservacion = crearReservacion(salida, ruta, req.getNumPeople(), req.getParticipantes(), cliente, null);
        asignarRecursos(salida);
        return reservacionMapper.toResponse(reservacion);
    }

    @Override
    @Transactional
    public ReservacionResponse actualizar(Long id, ReservacionUpdateRequest req, Long clienteId) {
        Reservacion reservacion = buscarReservacion(id);
        verificarPropietario(reservacion, clienteId);
        if (reservacion.getEstado() != EstadoReservacion.RESERVADO) {
            throw new ReglaNegocioException("Solo se pueden modificar reservaciones en estado RESERVADO.");
        }
        validarParticipantes(req.getNumPeople(), req.getParticipantes());

        reservacion.setNumPeople(req.getNumPeople());
        reservacion.setTotal(reservacion.getPrecioUnitario().multiply(BigDecimal.valueOf(req.getNumPeople())));

        // Reemplazar participantes
        participanteRepository.deleteByReservacionId(id);
        List<Participante> nuevos = req.getParticipantes().stream()
                .map(p -> {
                    Participante participante = participanteMapper.toEntity(p);
                    participante.setReservacion(reservacion);
                    return participante;
                }).toList();
        participanteRepository.saveAll(nuevos);
        reservacion.setParticipantes(nuevos);
        reservacionRepository.save(reservacion);

        // Reasignar recursos si el total de personas cambió
        asignarRecursos(reservacion.getSalida());
        return reservacionMapper.toResponse(reservacion);
    }

    @Override
    @Transactional
    public void cancelar(Long id, Long clienteId) {
        Reservacion reservacion = buscarReservacion(id);
        verificarPropietario(reservacion, clienteId);
        if (reservacion.getEstado() != EstadoReservacion.RESERVADO) {
            throw new ReglaNegocioException("Solo se pueden cancelar reservaciones en estado RESERVADO.");
        }
        reservacion.setEstado(EstadoReservacion.CANCELADO);
        reservacionRepository.save(reservacion);
    }

    @Override
    public ReservacionResponse obtener(Long id) {
        return reservacionMapper.toResponse(buscarReservacion(id));
    }

    @Override
    public List<ReservacionResponse> misReservaciones(Long clienteId) {
        return reservacionRepository.findByClienteId(clienteId)
                .stream().map(reservacionMapper::toResponse).toList();
    }

    // ─── helpers ────────────────────────────────────────────────────────────────

    private Salida obtenerOCrearSalida(Ruta ruta, LocalDate fecha, LocalTime tiempoInicio) {
        return salidaRepository.findSalidaProgramada(ruta.getId(), fecha, tiempoInicio)
                .orElseGet(() -> {
                    LocalTime tiempoFin = tiempoInicio.plusMinutes(ruta.getDuracionMinutos());
                    Salida nueva = Salida.builder()
                            .ruta(ruta)
                            .fechaProgramada(fecha)
                            .tiempoInicio(tiempoInicio)
                            .tiempoFin(tiempoFin)
                            .estado(EstadoSalida.PROGRAMADO)
                            .build();
                    return salidaRepository.save(nueva);
                });
    }

    private Reservacion crearReservacion(Salida salida, Ruta ruta, int numPeople,
                                          List<ParticipanteRequest> participantesReq,
                                          Usuario cliente, Usuario admin) {
        BigDecimal precioUnitario = ruta.getPrecio();
        Reservacion reservacion = Reservacion.builder()
                .salida(salida)
                .cliente(cliente)
                .admin(admin)
                .numPeople(numPeople)
                .precioUnitario(precioUnitario)
                .total(precioUnitario.multiply(BigDecimal.valueOf(numPeople)))
                .estado(EstadoReservacion.RESERVADO)
                .build();
        reservacion = reservacionRepository.save(reservacion);

        Reservacion finalReservacion = reservacion;
        List<Participante> participantes = participantesReq.stream()
                .map(p -> {
                    Participante participante = participanteMapper.toEntity(p);
                    participante.setReservacion(finalReservacion);
                    return participante;
                }).toList();
        participanteRepository.saveAll(participantes);
        reservacion.setParticipantes(participantes);
        return reservacion;
    }

    private void asignarRecursos(Salida salida) {
        int totalPersonas = reservacionRepository.sumarPersonasPorSalida(salida.getId());
        int caballosNecesarios = totalPersonas + 1;
        int caballosActuales = salidaCaballoRepository.countBySalidaId(salida.getId());
        int caballosAAsignar = caballosNecesarios - caballosActuales;

        if (caballosAAsignar > 0) {
            List<Caballo> disponibles = caballoRepository.findDisponibles(
                    salida.getId(),
                    salida.getFechaProgramada(),
                    salida.getTiempoInicio(),
                    salida.getTiempoFin(),
                    caballosAAsignar
            );
            if (disponibles.size() < caballosAAsignar) {
                throw new ReglaNegocioException(
                        "No hay suficientes caballos disponibles para esta salida. " +
                        "Se necesitan " + caballosAAsignar + " caballo(s) adicional(es) " +
                        "pero solo hay " + disponibles.size() + " disponible(s).");
            }
            List<SalidaCaballo> asignaciones = disponibles.stream()
                    .map(c -> SalidaCaballo.builder().salida(salida).caballo(c).build())
                    .toList();
            salidaCaballoRepository.saveAll(asignaciones);
        }

        if (!salidaGuiaRepository.existsBySalidaId(salida.getId())) {
            Guia guia = guiaRepository.findPrimerDisponible(
                    salida.getId(),
                    salida.getFechaProgramada(),
                    salida.getTiempoInicio(),
                    salida.getTiempoFin()
            ).orElseThrow(() -> new ReglaNegocioException(
                    "No hay guías disponibles para la fecha y hora de esta salida."));
            salidaGuiaRepository.save(SalidaGuia.builder().salida(salida).guia(guia).build());
        }
    }

    private void validarParticipantes(int numPeople, List<ParticipanteRequest> participantes) {
        if (participantes.size() != numPeople) {
            throw new ReglaNegocioException(
                    "El número de participantes (" + participantes.size() +
                    ") debe coincidir con num_people (" + numPeople + ").");
        }
    }

    private void verificarPropietario(Reservacion reservacion, Long clienteId) {
        if (reservacion.getCliente() == null || !reservacion.getCliente().getId().equals(clienteId)) {
            throw new ReglaNegocioException("No tienes permiso para modificar esta reservación.");
        }
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con id: " + id));
    }

    private Ruta buscarRuta(Long id) {
        return rutaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ruta no encontrada con id: " + id));
    }

    private Reservacion buscarReservacion(Long id) {
        return reservacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Reservación no encontrada con id: " + id));
    }
}
