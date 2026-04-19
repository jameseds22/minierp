package com.minierp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class QuickCreateProductRequest {

    @NotBlank
    private String nombre;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal costo;
}
