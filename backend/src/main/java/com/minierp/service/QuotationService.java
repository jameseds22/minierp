package com.minierp.service;

import com.minierp.dto.QuotationItemRequest;
import com.minierp.dto.QuotationRequest;
import com.minierp.entity.*;
import com.minierp.exception.ResourceNotFoundException;
import com.minierp.repository.ClientRepository;
import com.minierp.repository.ProductRepository;
import com.minierp.repository.QuotationRepository;
import com.minierp.repository.UserRepository;
import com.minierp.repository.WarehouseRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class QuotationService {

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");

    private final QuotationRepository quotationRepository;
    private final ClientRepository clientRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;

    public QuotationService(QuotationRepository quotationRepository,
                            ClientRepository clientRepository,
                            WarehouseRepository warehouseRepository,
                            ProductRepository productRepository,
                            UserRepository userRepository,
                            InventoryService inventoryService) {
        this.quotationRepository = quotationRepository;
        this.clientRepository = clientRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.inventoryService = inventoryService;
    }

    public List<Quotation> findAll() {
        return quotationRepository.findAll();
    }

    @Transactional
    public Quotation create(QuotationRequest request) {
        Client client = clientRepository.findById(request.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        Warehouse warehouse = warehouseRepository.findById(request.getAlmacenId())
                .orElseThrow(() -> new ResourceNotFoundException("Almacen no encontrado"));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado"));

        Quotation quotation = new Quotation();
        quotation.setCliente(client);
        quotation.setUsuario(user);
        quotation.setAlmacen(warehouse);
        quotation.setEstado(request.getEstado());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (QuotationItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

            BigDecimal detailSubtotal = product.getPrecio()
                    .multiply(BigDecimal.valueOf(itemRequest.getCantidad()))
                    .setScale(2, RoundingMode.HALF_UP);

            QuotationDetail detail = new QuotationDetail();
            detail.setCotizacion(quotation);
            detail.setProducto(product);
            detail.setCantidad(itemRequest.getCantidad());
            detail.setPrecioUnitario(product.getPrecio());
            detail.setSubtotal(detailSubtotal);

            quotation.getDetalles().add(detail);
            subtotal = subtotal.add(detailSubtotal);

            // La regla de negocio pide descontar stock al generar la cotizacion.
            inventoryService.discountStock(product.getId(), warehouse.getId(), itemRequest.getCantidad(),
                    "Salida por cotizacion");
        }

        BigDecimal igv = subtotal.multiply(IGV_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(igv).setScale(2, RoundingMode.HALF_UP);

        quotation.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        quotation.setIgv(igv);
        quotation.setTotal(total);
        return quotationRepository.save(quotation);
    }
}
