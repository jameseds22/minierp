package com.minierp.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InventoryResponse {
    private Long id;
    private Long productoId;
    private String producto;
    private String sku;
    private Long almacenId;
    private String almacen;
    private Integer stock;
}
