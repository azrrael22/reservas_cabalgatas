package cabalgatas_salento.reservas.controller;

import cabalgatas_salento.reservas.dto.request.LoginRequest;
import cabalgatas_salento.reservas.dto.request.RegistroRequest;
import cabalgatas_salento.reservas.dto.response.LoginResponse;
import cabalgatas_salento.reservas.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/registro")
    public ResponseEntity<LoginResponse> registro(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registro(request));
    }

    /** Solo funciona cuando no existe ningún admin en el sistema. */
    @PostMapping("/registro-admin")
    public ResponseEntity<LoginResponse> registroAdmin(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registroAdmin(request));
    }
}
