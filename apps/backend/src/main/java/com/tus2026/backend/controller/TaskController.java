package com.tus2026.backend.controller;

import com.tus2026.backend.Models.Task;
import com.tus2026.backend.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:8080")
public class TaskController {

    @Autowired
    private TaskRepository repo;

    @PostMapping("/addTask")
    public ResponseEntity<?> saveTask(@RequestBody Task task){
        try{
            Task savedTask = repo.save(task);
            return ResponseEntity.status(201).body(savedTask);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving task: " + e.getMessage());
        }
    }

    @GetMapping("/findAllTasks")
    public ResponseEntity<?> getTasks() {
         try {
            List<Task> tasks = repo.findAll();
            return ResponseEntity.status(200).body(tasks);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(List.of("error", "Failed to fetch tasks"));
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTask(@PathVariable String id, @RequestBody Task task){
         try {
            Optional<Task> optionalTask = repo.findById(id);

            if (optionalTask.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body(Map.of("error", "Task not found"));
            }

            Task existingTask = optionalTask.get();

            existingTask.setTaskName(task.getTaskName());
            existingTask.setDifficulty(task.getDifficulty());
            existingTask.setTaskDesc(task.getTaskDesc());
            existingTask.setAssigneeId(task.getAssigneeId());
            existingTask.setEffort(task.getEffort());
            existingTask.setStatus(task.getStatus());

            Task updatedTask = repo.save(existingTask);

            return ResponseEntity.status(200).body(updatedTask);

        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "Failed to update task"));
        }
    }

    @GetMapping("/findByName")
    public ResponseEntity<?> getTaskByName(@RequestParam String name){
        try{
            List<Task> tasks = repo.findByTaskNameContainingIgnoreCase(name);
            return ResponseEntity.status(200).body(tasks);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch tasks by name"));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable String id){
        try{
            if (!repo.existsById(id)) {
                return ResponseEntity.status(404).body("Task not found");
            }repo.deleteById(id);
                    return ResponseEntity.status(200).body("Deleted Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting task: " + e.getMessage());
        
    }

    }
}
