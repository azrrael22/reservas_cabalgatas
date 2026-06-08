package cabalgatas_salento.reservas.entity;

import cabalgatas_salento.reservas.entity.enums.EstadoSalida;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salidas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Salida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ruta_id", nullable = false)
    private Ruta ruta;

    @Column(name = "fecha_programada", nullable = false)
    private LocalDate fechaProgramada;

    @Column(name = "tiempo_inicio", nullable = false)
    private LocalTime tiempoInicio;

    @Column(name = "tiempo_fin", nullable = false)
    private LocalTime tiempoFin;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private EstadoSalida estado = EstadoSalida.PROGRAMADO;

    @OneToMany(mappedBy = "salida", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SalidaCaballo> caballos = new ArrayList<>();

    @OneToMany(mappedBy = "salida", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SalidaGuia> guias = new ArrayList<>();
}
