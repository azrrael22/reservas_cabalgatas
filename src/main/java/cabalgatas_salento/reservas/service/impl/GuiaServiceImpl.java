package cabalgatas_salento.reservas.service.impl;

import cabalgatas_salento.reservas.dto.request.GuiaRequest;
import cabalgatas_salento.reservas.dto.response.GuiaResponse;
import cabalgatas_salento.reservas.entity.Guia;
import cabalgatas_salento.reservas.exception.RecursoNoEncontradoException;
import cabalgatas_salento.reservas.exception.ReglaNegocioException;
import cabalgatas_salento.reservas.mapper.GuiaMapper;
import cabalgatas_salento.reservas.repository.GuiaRepository;
import cabalgatas_salento.reservas.service.GuiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GuiaServiceImpl implements GuiaService {

    private final GuiaRepository guiaRepository;
    private final GuiaMapper guiaMapper;

    @Override
    public List<GuiaResponse> listar() {
        return guiaRepository.findByEliminadoFalse()
                .stream().map(guiaMapper::toResponse).toList();
    }

    @Override
    public GuiaResponse obtener(Long id) {
        return guiaMapper.toResponse(buscar(id));
    }

    @Override
    public GuiaResponse crear(GuiaRequest request) {
        Guia guia = guiaMapper.toEntity(request);
        return guiaMapper.toResponse(guiaRepository.save(guia));
    }

    @Override
    public GuiaResponse actualizar(Long id, GuiaRequest request) {
        Guia guia = buscar(id);
        validarNoEliminado(guia);
        guia.setPrimerNombre(request.getPrimerNombre());
        guia.setPrimerApellido(request.getPrimerApellido());
        guia.setTipoDocumento(request.getTipoDocumento());
        guia.setFechaNacimiento(request.getFechaNacimiento());
        guia.setDocumento(request.getDocumento());
        guia.setTelefono(request.getTelefono());
        guia.setEmail(request.getEmail());
        return guiaMapper.toResponse(guiaRepository.save(guia));
    }

    @Override
    public void activar(Long id) {
        Guia guia = buscar(id);
        validarNoEliminado(guia);
        guia.setIsActive(true);
        guiaRepository.save(guia);
    }

    @Override
    public void desactivar(Long id) {
        Guia guia = buscar(id);
        validarNoEliminado(guia);
        guia.setIsActive(false);
        guiaRepository.save(guia);
    }

    @Override
    public void eliminar(Long id) {
        Guia guia = buscar(id);
        guia.setEliminado(true);
        guia.setIsActive(false);
        guiaRepository.save(guia);
    }

    private Guia buscar(Long id) {
        return guiaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Guía no encontrada con id: " + id));
    }

    private void validarNoEliminado(Guia guia) {
        if (Boolean.TRUE.equals(guia.getEliminado())) {
            throw new ReglaNegocioException("La guía con id " + guia.getId() + " fue eliminada y no puede modificarse.");
        }
    }
}
