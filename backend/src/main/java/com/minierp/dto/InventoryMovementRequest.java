package com.minierp.dto;

import com.minierp.entity.MovimientoTipo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryMovementRequest {

    @NotNull
    private Long productoId;

    @NotNull
    private Long almacenId;

    @NotNull
    private MovimientoTipo tipo;

    @NotNull
    @Min(1)
    private Integer cantidad;

    @NotBlank
    private String motivo;
}
