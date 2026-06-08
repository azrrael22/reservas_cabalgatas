package cabalgatas_salento.reservas.service;

import cabalgatas_salento.reservas.dto.request.LoginRequest;
import cabalgatas_salento.reservas.dto.request.RegistroRequest;
import cabalgatas_salento.reservas.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse registro(RegistroRequest request);
    LoginResponse registroAdmin(RegistroRequest request);
}
