package cabalgatas_salento.reservas.entity;

import cabalgatas_salento.reservas.entity.enums.TipoDocumento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "GUIAS")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Guia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "primer_nombre", nullable = false, length = 100)
    private String primerNombre;

    @Column(name = "primer_apellido", nullable = false, length = 100)
    private String primerApellido;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false, length = 20)
    private TipoDocumento tipoDocumento;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(nullable = false, unique = true, length = 50)
    private String documento;

    @Column(length = 20)
    private String telefono;

    @Column(length = 150)
    private String email;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean eliminado = false;
}
