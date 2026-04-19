package com.minierp.controller;

import com.minierp.dto.QuotationRequest;
import com.minierp.entity.Quotation;
import com.minierp.service.QuotationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cotizaciones")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @GetMapping
    public List<Quotation> list() {
        return quotationService.findAll();
    }

    @PostMapping
    public Quotation create(@Valid @RequestBody QuotationRequest request) {
        return quotationService.create(request);
    }
}
