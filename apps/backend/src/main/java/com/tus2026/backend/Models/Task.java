package com.tus2026.backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Tasks")
public class Task {

   @Id
    private String id;
    @Field("task_name")
    private String taskName;
    @Field("difficulty")
    private TaskDifficulty difficulty;
    @Field("task_desc")
    private String taskDesc;
    @Field("assignee_id")
    private String assigneeId; // reference to Employee id
    @Field("effort")
    private int effort;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
    @Field("status")
    private Status status;
}



