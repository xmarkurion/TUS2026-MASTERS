package com.tus2026.backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tus2026.backend.Models.ProjectContext;

@Repository
public interface ProjectContextRepository extends MongoRepository<ProjectContext, String> {
}