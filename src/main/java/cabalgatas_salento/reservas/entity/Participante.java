package cabalgatas_salento.reservas.entity;

import cabalgatas_salento.reservas.entity.enums.TipoDocumento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "participantes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Participante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservacion_id", nullable = false)
    private Reservacion reservacion;

    @Column(name = "primer_nombre", nullable = false, length = 100)
    private String primerNombre;

    @Column(name = "primer_apellido", nullable = false, length = 100)
    private String primerApellido;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false, length = 20)
    private TipoDocumento tipoDocumento;

    @Column(nullable = false, length = 50)
    private String documento;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "altura_cm", nullable = false)
    private Short alturaCm;

    @Column(name = "peso_kg", nullable = false, precision = 5, scale = 2)
    private BigDecimal pesoKg;
}
