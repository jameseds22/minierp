package com.minierp.config;

import com.minierp.entity.Role;
import com.minierp.entity.RoleName;
import com.minierp.entity.User;
import com.minierp.repository.RoleRepository;
import com.minierp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByNombre(RoleName.ADMIN).orElseGet(() -> {
            Role role = new Role();
            role.setNombre(RoleName.ADMIN);
            return roleRepository.save(role);
        });

        roleRepository.findByNombre(RoleName.VENDEDOR).orElseGet(() -> {
            Role role = new Role();
            role.setNombre(RoleName.VENDEDOR);
            return roleRepository.save(role);
        });

        userRepository.findByUsername("admin").orElseGet(() -> {
            User user = new User();
            user.setUsername("admin");
            user.setPassword(passwordEncoder.encode("Admin123*"));
            user.setRole(adminRole);
            user.setActivo(true);
            return userRepository.save(user);
        });
    }
}
