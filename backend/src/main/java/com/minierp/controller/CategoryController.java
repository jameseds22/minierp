package com.minierp.controller;

import com.minierp.entity.Category;
import com.minierp.service.CatalogServices;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoryController {

    private final CatalogServices services;

    public CategoryController(CatalogServices services) {
        this.services = services;
    }

    @GetMapping
    public List<Category> list() { return services.categories().findAll(); }

    @PostMapping
    public Category create(@RequestBody Category entity) { return services.categories().save(entity); }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category entity) {
        entity.setId(id);
        return services.categories().save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { services.categories().delete(id); }
}
