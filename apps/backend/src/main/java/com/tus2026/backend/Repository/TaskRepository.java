package com.tus2026.backend.Repository;

import com.tus2026.backend.Models.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface TaskRepository extends MongoRepository<Task, String> {

    @Query("{taskName:'?0'}")
    Task findByName(String taskName);
}
