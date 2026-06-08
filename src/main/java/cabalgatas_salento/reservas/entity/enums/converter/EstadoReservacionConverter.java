package cabalgatas_salento.reservas.entity.enums.converter;

import cabalgatas_salento.reservas.entity.enums.EstadoReservacion;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoReservacionConverter implements AttributeConverter<EstadoReservacion, String> {

    @Override
    public String convertToDatabaseColumn(EstadoReservacion attribute) {
        return attribute == null ? null : attribute.getValorBD();
    }

    @Override
    public EstadoReservacion convertToEntityAttribute(String dbData) {
        return dbData == null ? null : EstadoReservacion.fromValorBD(dbData);
    }
}
