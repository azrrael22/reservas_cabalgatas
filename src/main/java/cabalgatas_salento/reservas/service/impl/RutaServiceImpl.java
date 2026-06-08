package cabalgatas_salento.reservas.service.impl;

import cabalgatas_salento.reservas.dto.request.RutaRequest;
import cabalgatas_salento.reservas.dto.response.RutaResponse;
import cabalgatas_salento.reservas.entity.Ruta;
import cabalgatas_salento.reservas.exception.RecursoNoEncontradoException;
import cabalgatas_salento.reservas.exception.ReglaNegocioException;
import cabalgatas_salento.reservas.mapper.RutaMapper;
import cabalgatas_salento.reservas.repository.RutaRepository;
import cabalgatas_salento.reservas.service.RutaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RutaServiceImpl implements RutaService {

    private final RutaRepository rutaRepository;
    private final RutaMapper rutaMapper;

    @Override
    public List<RutaResponse> listar() {
        return rutaRepository.findByEliminadoFalse()
                .stream().map(rutaMapper::toResponse).toList();
    }

    @Override
    public RutaResponse obtener(Long id) {
        return rutaMapper.toResponse(buscar(id));
    }

    @Override
    public RutaResponse crear(RutaRequest request) {
        Ruta ruta = rutaMapper.toEntity(request);
        return rutaMapper.toResponse(rutaRepository.save(ruta));
    }

    @Override
    public RutaResponse actualizar(Long id, RutaRequest request) {
        Ruta ruta = buscar(id);
        validarNoEliminada(ruta);
        ruta.setNombre(request.getNombre());
        ruta.setDescripcion(request.getDescripcion());
        ruta.setPrecio(request.getPrecio());
        ruta.setDificultad(request.getDificultad());
        ruta.setDuracionMinutos(request.getDuracionMinutos());
        ruta.setImageUrl(request.getImageUrl());
        return rutaMapper.toResponse(rutaRepository.save(ruta));
    }

    @Override
    public void activar(Long id) {
        Ruta ruta = buscar(id);
        validarNoEliminada(ruta);
        ruta.setIsActive(true);
        rutaRepository.save(ruta);
    }

    @Override
    public void desactivar(Long id) {
        Ruta ruta = buscar(id);
        validarNoEliminada(ruta);
        ruta.setIsActive(false);
        rutaRepository.save(ruta);
    }

    @Override
    public void eliminar(Long id) {
        Ruta ruta = buscar(id);
        ruta.setEliminado(true);
        ruta.setIsActive(false);
        rutaRepository.save(ruta);
    }

    private Ruta buscar(Long id) {
        return rutaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ruta no encontrada con id: " + id));
    }

    private void validarNoEliminada(Ruta ruta) {
        if (Boolean.TRUE.equals(ruta.getEliminado())) {
            throw new ReglaNegocioException("La ruta con id " + ruta.getId() + " fue eliminada y no puede modificarse.");
        }
    }
}
