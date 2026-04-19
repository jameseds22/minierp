package com.minierp.controller;

import com.minierp.entity.Warehouse;
import com.minierp.service.CatalogServices;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/almacenes")
public class WarehouseController {

    private final CatalogServices services;

    public WarehouseController(CatalogServices services) {
        this.services = services;
    }

    @GetMapping
    public List<Warehouse> list() { return services.warehouses().findAll(); }

    @PostMapping
    public Warehouse create(@RequestBody Warehouse entity) { return services.warehouses().save(entity); }

    @PutMapping("/{id}")
    public Warehouse update(@PathVariable Long id, @RequestBody Warehouse entity) {
        entity.setId(id);
        return services.warehouses().save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { services.warehouses().delete(id); }
}
