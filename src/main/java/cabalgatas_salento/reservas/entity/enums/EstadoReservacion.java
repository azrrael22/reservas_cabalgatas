package cabalgatas_salento.reservas.entity.enums;

public enum EstadoReservacion {
    RESERVADO("reservado"),
    EN_CURSO("en_curso"),
    COMPLETADO("completado"),
    CANCELADO("cancelado");

    private final String valorBD;

    EstadoReservacion(String valorBD) {
        this.valorBD = valorBD;
    }

    public String getValorBD() {
        return valorBD;
    }

    public static EstadoReservacion fromValorBD(String v) {
        for (EstadoReservacion e : values()) {
            if (e.valorBD.equals(v)) return e;
        }
        throw new IllegalArgumentException("Estado de reservación desconocido: " + v);
    }
}
