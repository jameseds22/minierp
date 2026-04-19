package com.minierp.service;

import com.minierp.exception.ResourceNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public class CrudService<T> {

    private final JpaRepository<T, Long> repository;
    private final String resourceName;

    public CrudService(JpaRepository<T, Long> repository, String resourceName) {
        this.repository = repository;
        this.resourceName = resourceName;
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public T findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(resourceName + " no encontrado"));
    }

    public T save(T entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        T entity = findById(id);
        repository.delete(entity);
    }
}
