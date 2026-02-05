package com.tus2026.backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "members")
public class Member {

    @Id
    private String id; // EMP-003

    private String name;
    private String position;
    private String personalBackground;
    private List<String> skills;
    private int availableCapacity;
}
