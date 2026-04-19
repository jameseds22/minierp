package com.minierp.service;

import com.minierp.dto.CreateUserRequest;
import com.minierp.entity.Role;
import com.minierp.entity.User;
import com.minierp.exception.BusinessException;
import com.minierp.exception.ResourceNotFoundException;
import com.minierp.repository.RoleRepository;
import com.minierp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(UserRepository userRepository,
                                 RoleRepository roleRepository,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User create(CreateUserRequest request) {
        userRepository.findByUsername(request.getUsername().trim())
                .ifPresent(user -> {
                    throw new BusinessException("El usuario ya existe");
                });

        Role role = roleRepository.findByNombre(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setActivo(true);
        return userRepository.save(user);
    }
}
