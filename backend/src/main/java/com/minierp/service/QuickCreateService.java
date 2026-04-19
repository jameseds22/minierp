package com.minierp.service;

import com.minierp.dto.QuickCreateClientRequest;
import com.minierp.dto.QuickCreateProductRequest;
import com.minierp.entity.Category;
import com.minierp.entity.Client;
import com.minierp.entity.Product;
import com.minierp.repository.CategoryRepository;
import com.minierp.repository.ClientRepository;
import com.minierp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class QuickCreateService {

    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository;

    public QuickCreateService(ProductRepository productRepository,
                              ClientRepository clientRepository,
                              CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.clientRepository = clientRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product createQuickProduct(QuickCreateProductRequest request) {
        Category defaultCategory = categoryRepository.findByNombre("General")
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setNombre("General");
                    category.setDescripcion("Categoria generada automaticamente");
                    return categoryRepository.save(category);
                });

        Product product = new Product();
        product.setNombre(request.getNombre().trim());
        product.setDescripcion("Producto creado desde alta rapida");
        product.setCosto(request.getCosto());
        product.setPrecio(request.getCosto());
        product.setSku("AUTO-" + Instant.now().toEpochMilli());
        product.setCategoria(defaultCategory);
        return productRepository.save(product);
    }

    public Client createQuickClient(QuickCreateClientRequest request) {
        Client client = new Client();
        client.setNombre(request.getNombre().trim());
        client.setDocumento("TMP-" + Instant.now().toEpochMilli());
        client.setEmail(null);
        client.setTelefono(null);
        return clientRepository.save(client);
    }
}
