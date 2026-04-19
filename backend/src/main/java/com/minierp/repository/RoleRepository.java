package com.minierp.repository;

import com.minierp.entity.Role;
import com.minierp.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByNombre(RoleName nombre);
}
