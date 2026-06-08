package cabalgatas_salento.reservas.entity.enums;

public enum EstadoSalida {
    PROGRAMADO("programado"),
    EN_CURSO("en_curso"),
    COMPLETADO("completado"),
    CANCELADO("cancelado");

    private final String valorBD;

    EstadoSalida(String valorBD) {
        this.valorBD = valorBD;
    }

    public String getValorBD() {
        return valorBD;
    }

    public static EstadoSalida fromValorBD(String v) {
        for (EstadoSalida e : values()) {
            if (e.valorBD.equals(v)) return e;
        }
        throw new IllegalArgumentException("Estado de salida desconocido: " + v);
    }
}
