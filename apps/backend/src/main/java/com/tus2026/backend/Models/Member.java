package com.tus2026.backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Members")
public class Member {

    @Id
    private String id; // EMP-003
    @Field("person_name")
    private String name;
    @Field("position")
    private String position;
    @Field("personal_background")
    private String personalBackground;
    @Field("skills")
    private List<String> skills;
    @Field("available_capacity")
    private int availableCapacity;
}
