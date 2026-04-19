package com.minierp.service;

import com.minierp.entity.*;
import com.minierp.repository.*;
import org.springframework.stereotype.Service;

@Service
public class CatalogServices {

    private final CrudService<Client> clientService;
    private final CrudService<Category> categoryService;
    private final CrudService<Product> productService;
    private final CrudService<Warehouse> warehouseService;
    private final CrudService<User> userService;

    public CatalogServices(ClientRepository clientRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           WarehouseRepository warehouseRepository,
                           UserRepository userRepository) {
        this.clientService = new CrudService<>(clientRepository, "Cliente");
        this.categoryService = new CrudService<>(categoryRepository, "Categoria");
        this.productService = new CrudService<>(productRepository, "Producto");
        this.warehouseService = new CrudService<>(warehouseRepository, "Almacen");
        this.userService = new CrudService<>(userRepository, "Usuario");
    }

    public CrudService<Client> clients() { return clientService; }
    public CrudService<Category> categories() { return categoryService; }
    public CrudService<Product> products() { return productService; }
    public CrudService<Warehouse> warehouses() { return warehouseService; }
    public CrudService<User> users() { return userService; }
}
