package com.minierp.controller;

import com.minierp.dto.QuickCreateClientRequest;
import com.minierp.entity.Client;
import com.minierp.service.CatalogServices;
import com.minierp.service.QuickCreateService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClientController {

    private final CatalogServices services;
    private final QuickCreateService quickCreateService;

    public ClientController(CatalogServices services, QuickCreateService quickCreateService) {
        this.services = services;
        this.quickCreateService = quickCreateService;
    }

    @GetMapping
    public List<Client> list() { return services.clients().findAll(); }

    @PostMapping
    public Client create(@RequestBody Client entity) { return services.clients().save(entity); }

    @PostMapping("/quick")
    public Client createQuick(@Valid @RequestBody QuickCreateClientRequest request) {
        return quickCreateService.createQuickClient(request);
    }

    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client entity) {
        entity.setId(id);
        return services.clients().save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { services.clients().delete(id); }
}
