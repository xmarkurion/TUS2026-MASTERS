package com.tus2026.backend.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "ProjectContext")
public class ProjectContext {

    @Id
    private String id;

    @Field("project_name")
    private String projectName;

    @Field("description")
    private String description;

    @Field("tech_stack")
    private List<String> techStack;

    @Field("features_implemented")
    private List<String> featuresImplemented;

    @Field("conventions")
    private String conventions;

}
