package com.minierp.controller;

import com.minierp.dto.InventoryMovementRequest;
import com.minierp.dto.InventoryResponse;
import com.minierp.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<InventoryResponse> list() {
        return inventoryService.findAll();
    }

    @PostMapping("/movimientos")
    public InventoryResponse registerMovement(@Valid @RequestBody InventoryMovementRequest request) {
        return inventoryService.registerMovement(request);
    }
}
