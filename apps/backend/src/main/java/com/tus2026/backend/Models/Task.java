package com.tus2026.backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {

   @Id
    private String id;
    private String taskName;
    private Integer difficulty;
    private String taskDesc;
    private String assigneeId; // reference to Employee id
    private int effort;
}
