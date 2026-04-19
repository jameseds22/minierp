package com.minierp.dto;

import com.minierp.entity.CotizacionEstado;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuotationRequest {

    @NotNull
    private Long clienteId;

    @NotNull
    private Long almacenId;

    @NotNull
    private CotizacionEstado estado;

    @Valid
    @NotEmpty
    private List<QuotationItemRequest> items;
}
