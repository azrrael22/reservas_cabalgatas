package cabalgatas_salento.reservas.repository;

import cabalgatas_salento.reservas.entity.Usuario;
import cabalgatas_salento.reservas.entity.enums.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByDocumento(String documento);
    boolean existsByRole(RolUsuario role);
}
