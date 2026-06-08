package cabalgatas_salento.reservas.service.impl;

import cabalgatas_salento.reservas.dto.request.LoginRequest;
import cabalgatas_salento.reservas.dto.request.RegistroRequest;
import cabalgatas_salento.reservas.dto.response.LoginResponse;
import cabalgatas_salento.reservas.entity.Usuario;
import cabalgatas_salento.reservas.entity.enums.EstadoUsuario;
import cabalgatas_salento.reservas.entity.enums.RolUsuario;
import cabalgatas_salento.reservas.exception.ReglaNegocioException;
import cabalgatas_salento.reservas.repository.UsuarioRepository;
import cabalgatas_salento.reservas.security.JwtUtil;
import cabalgatas_salento.reservas.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails userDetails = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();
        Usuario usuario = (Usuario) userDetails;
        String token = jwtUtil.generarToken(userDetails);
        return LoginResponse.builder()
                .token(token)
                .tipo("Bearer")
                .rol(usuario.getRole().name())
                .userId(usuario.getId())
                .email(usuario.getEmail())
                .build();
    }

    @Override
    public LoginResponse registro(RegistroRequest request) {
        return crearUsuario(request, RolUsuario.CLIENTE);
    }

    @Override
    public LoginResponse registroAdmin(RegistroRequest request) {
        if (usuarioRepository.existsByRole(RolUsuario.ADMIN)) {
            throw new ReglaNegocioException(
                    "Ya existe un administrador. Use el endpoint de login o contacte al administrador actual.");
        }
        return crearUsuario(request, RolUsuario.ADMIN);
    }

    private LoginResponse crearUsuario(RegistroRequest request, RolUsuario rol) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ReglaNegocioException("El email '" + request.getEmail() + "' ya está registrado.");
        }
        if (usuarioRepository.existsByDocumento(request.getDocumento())) {
            throw new ReglaNegocioException("El documento '" + request.getDocumento() + "' ya está registrado.");
        }
        Usuario usuario = Usuario.builder()
                .primerNombre(request.getPrimerNombre())
                .primerApellido(request.getPrimerApellido())
                .tipoDocumento(request.getTipoDocumento())
                .fechaNacimiento(request.getFechaNacimiento())
                .documento(request.getDocumento())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .role(rol)
                .estado(EstadoUsuario.ACTIVO)
                .build();
        usuario = usuarioRepository.save(usuario);
        String token = jwtUtil.generarToken(usuario);
        return LoginResponse.builder()
                .token(token)
                .tipo("Bearer")
                .rol(usuario.getRole().name())
                .userId(usuario.getId())
                .email(usuario.getEmail())
                .build();
    }
}
