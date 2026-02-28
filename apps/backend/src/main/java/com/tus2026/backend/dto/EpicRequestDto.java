package com.tus2026.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EpicRequestDto {
    @NotBlank(message = "Epic description must not be blank")
    private String epicDescription;
}
