package com.tus2026.backend.Repository;

import com.tus2026.backend.Models.Task;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface TaskRepository extends MongoRepository<Task, String> {

    Task findByTaskName(String taskName);
    List<Task> findByTaskNameContainingIgnoreCase(String taskName);
}
