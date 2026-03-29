package com.tus2026.backend.dto;

import java.util.List;

public record MemberResponseDto(
        String id,
        String name,
        String position,
        String personalBackground,
        List<String> skills,
        int totalCapacity,
        int availableCapacity
) {}
