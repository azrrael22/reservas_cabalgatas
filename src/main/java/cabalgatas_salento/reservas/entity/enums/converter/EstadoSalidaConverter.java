package cabalgatas_salento.reservas.entity.enums.converter;

import cabalgatas_salento.reservas.entity.enums.EstadoSalida;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoSalidaConverter implements AttributeConverter<EstadoSalida, String> {

    @Override
    public String convertToDatabaseColumn(EstadoSalida attribute) {
        return attribute == null ? null : attribute.getValorBD();
    }

    @Override
    public EstadoSalida convertToEntityAttribute(String dbData) {
        return dbData == null ? null : EstadoSalida.fromValorBD(dbData);
    }
}
