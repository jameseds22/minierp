package com.minierp.controller;

import com.minierp.dto.CreateUserRequest;
import com.minierp.entity.User;
import com.minierp.service.CatalogServices;
import com.minierp.service.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UserController {

    private final CatalogServices services;
    private final UserManagementService userManagementService;

    public UserController(CatalogServices services, UserManagementService userManagementService) {
        this.services = services;
        this.userManagementService = userManagementService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> list() { return services.users().findAll(); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public User create(@Valid @RequestBody CreateUserRequest request) {
        return userManagementService.create(request);
    }
}
