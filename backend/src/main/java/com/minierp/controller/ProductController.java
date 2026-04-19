package com.minierp.controller;

import com.minierp.dto.QuickCreateProductRequest;
import com.minierp.entity.Product;
import com.minierp.service.CatalogServices;
import com.minierp.service.QuickCreateService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductController {

    private final CatalogServices services;
    private final QuickCreateService quickCreateService;

    public ProductController(CatalogServices services, QuickCreateService quickCreateService) {
        this.services = services;
        this.quickCreateService = quickCreateService;
    }

    @GetMapping
    public List<Product> list() { return services.products().findAll(); }

    @PostMapping
    public Product create(@RequestBody Product entity) { return services.products().save(entity); }

    @PostMapping("/quick")
    public Product createQuick(@Valid @RequestBody QuickCreateProductRequest request) {
        return quickCreateService.createQuickProduct(request);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product entity) {
        entity.setId(id);
        return services.products().save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { services.products().delete(id); }
}
