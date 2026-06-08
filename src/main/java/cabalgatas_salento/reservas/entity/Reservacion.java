package cabalgatas_salento.reservas.entity;

import cabalgatas_salento.reservas.entity.enums.EstadoReservacion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservaciones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salida_id", nullable = false)
    private Salida salida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Usuario cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private Usuario admin;

    @Column(name = "num_people", nullable = false)
    private Integer numPeople;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, precision = 20, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private EstadoReservacion estado = EstadoReservacion.RESERVADO;

    @OneToMany(mappedBy = "reservacion", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Participante> participantes = new ArrayList<>();
}
