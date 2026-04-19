package com.minierp.repository;

import com.minierp.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductoIdAndAlmacenId(Long productoId, Long almacenId);
}
