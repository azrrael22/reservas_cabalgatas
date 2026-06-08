package cabalgatas_salento.reservas.service.impl;

import cabalgatas_salento.reservas.dto.request.CaballoRequest;
import cabalgatas_salento.reservas.dto.response.CaballoResponse;
import cabalgatas_salento.reservas.entity.Caballo;
import cabalgatas_salento.reservas.exception.RecursoNoEncontradoException;
import cabalgatas_salento.reservas.exception.ReglaNegocioException;
import cabalgatas_salento.reservas.mapper.CaballoMapper;
import cabalgatas_salento.reservas.repository.CaballoRepository;
import cabalgatas_salento.reservas.service.CaballoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaballoServiceImpl implements CaballoService {

    private final CaballoRepository caballoRepository;
    private final CaballoMapper caballoMapper;

    @Override
    public List<CaballoResponse> listar() {
        return caballoRepository.findByEliminadoFalse()
                .stream().map(caballoMapper::toResponse).toList();
    }

    @Override
    public CaballoResponse obtener(Long id) {
        return caballoMapper.toResponse(buscar(id));
    }

    @Override
    public CaballoResponse crear(CaballoRequest request) {
        Caballo caballo = caballoMapper.toEntity(request);
        return caballoMapper.toResponse(caballoRepository.save(caballo));
    }

    @Override
    public CaballoResponse actualizar(Long id, CaballoRequest request) {
        Caballo caballo = buscar(id);
        validarNoEliminado(caballo);
        caballo.setNombre(request.getNombre());
        caballo.setRaza(request.getRaza());
        return caballoMapper.toResponse(caballoRepository.save(caballo));
    }

    @Override
    public void activar(Long id) {
        Caballo caballo = buscar(id);
        validarNoEliminado(caballo);
        caballo.setIsActive(true);
        caballoRepository.save(caballo);
    }

    @Override
    public void desactivar(Long id) {
        Caballo caballo = buscar(id);
        validarNoEliminado(caballo);
        caballo.setIsActive(false);
        caballoRepository.save(caballo);
    }

    @Override
    public void eliminar(Long id) {
        Caballo caballo = buscar(id);
        caballo.setEliminado(true);
        caballo.setIsActive(false);
        caballoRepository.save(caballo);
    }

    private Caballo buscar(Long id) {
        return caballoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Caballo no encontrado con id: " + id));
    }

    private void validarNoEliminado(Caballo caballo) {
        if (Boolean.TRUE.equals(caballo.getEliminado())) {
            throw new ReglaNegocioException("El caballo con id " + caballo.getId() + " fue eliminado y no puede modificarse.");
        }
    }
}
