package cabalgatas_salento.reservas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "salida_guias")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalidaGuia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salida_id", nullable = false)
    private Salida salida;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "guia_id", nullable = false)
    private Guia guia;
}
