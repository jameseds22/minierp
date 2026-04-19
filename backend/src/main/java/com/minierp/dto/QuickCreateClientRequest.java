package com.minierp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuickCreateClientRequest {

    @NotBlank
    private String nombre;
}
