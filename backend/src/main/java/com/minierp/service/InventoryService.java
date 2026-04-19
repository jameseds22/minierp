package com.minierp.service;

import com.minierp.dto.InventoryMovementRequest;
import com.minierp.dto.InventoryResponse;
import com.minierp.entity.Inventory;
import com.minierp.entity.InventoryMovement;
import com.minierp.entity.MovimientoTipo;
import com.minierp.exception.BusinessException;
import com.minierp.exception.ResourceNotFoundException;
import com.minierp.repository.InventoryMovementRepository;
import com.minierp.repository.InventoryRepository;
import com.minierp.repository.ProductRepository;
import com.minierp.repository.WarehouseRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryMovementRepository movementRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            ProductRepository productRepository,
                            WarehouseRepository warehouseRepository,
                            InventoryMovementRepository movementRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.movementRepository = movementRepository;
    }

    public List<InventoryResponse> findAll() {
        return inventoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public InventoryResponse registerMovement(InventoryMovementRequest request) {
        Inventory inventory = inventoryRepository.findByProductoIdAndAlmacenId(request.getProductoId(), request.getAlmacenId())
                .orElseGet(() -> {
                    Inventory newInventory = new Inventory();
                    newInventory.setProducto(productRepository.findById(request.getProductoId())
                            .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado")));
                    newInventory.setAlmacen(warehouseRepository.findById(request.getAlmacenId())
                            .orElseThrow(() -> new ResourceNotFoundException("Almacen no encontrado")));
                    newInventory.setStock(0);
                    return newInventory;
                });

        int stockActual = inventory.getStock();
        int stockNuevo = request.getTipo() == MovimientoTipo.ENTRADA
                ? stockActual + request.getCantidad()
                : stockActual - request.getCantidad();

        if (stockNuevo < 0) {
            throw new BusinessException("Stock insuficiente para la salida solicitada");
        }

        inventory.setStock(stockNuevo);
        Inventory savedInventory = inventoryRepository.save(inventory);

        InventoryMovement movement = new InventoryMovement();
        movement.setInventario(savedInventory);
        movement.setTipo(request.getTipo());
        movement.setCantidad(request.getCantidad());
        movement.setMotivo(request.getMotivo());
        movementRepository.save(movement);

        return toResponse(savedInventory);
    }

    @Transactional
    public void discountStock(Long productoId, Long almacenId, Integer cantidad, String motivo) {
        InventoryMovementRequest request = new InventoryMovementRequest();
        request.setProductoId(productoId);
        request.setAlmacenId(almacenId);
        request.setCantidad(cantidad);
        request.setTipo(MovimientoTipo.SALIDA);
        request.setMotivo(motivo);
        registerMovement(request);
    }

    private InventoryResponse toResponse(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .productoId(inventory.getProducto().getId())
                .producto(inventory.getProducto().getNombre())
                .sku(inventory.getProducto().getSku())
                .almacenId(inventory.getAlmacen().getId())
                .almacen(inventory.getAlmacen().getNombre())
                .stock(inventory.getStock())
                .build();
    }
}
