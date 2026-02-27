package com.tus2026.backend.controller;

import com.tus2026.backend.Models.Task;
import com.tus2026.backend.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:8080")
public class TaskController {

    @Autowired
    private TaskRepository repo;

    @PostMapping("/addTask")
    public String saveTask(@RequestBody Task task){
        repo.save(task);

        return "Added Successfully";
    }

    @GetMapping("/findAllTasks")
    public List<Task> getTasks() {
        return repo.findAll();
    }
    @PutMapping("/update/{id}")
    public String updateTask(@PathVariable String id, @RequestBody Task task){
        Task existingTask = repo.findById(id).orElse(null);
        if (existingTask != null) {
            existingTask.setTaskName(task.getTaskName());
            existingTask.setDifficulty(task.getDifficulty());
            existingTask.setTaskDesc(task.getTaskDesc());
            existingTask.setAssigneeId(task.getAssigneeId());
            existingTask.setEffort(task.getEffort());
            existingTask.setStatus(task.getStatus());
            repo.save(existingTask);
            return "Updated Successfully";
        } else {
            return "Task not found";
        }
    }

    @GetMapping("/findByName")
    public List<Task> getTaskByName(@RequestParam String name){
        return repo.findByTaskNameContainingIgnoreCase(name);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteTask(@PathVariable String id){
        repo.deleteById(id);

        return "Deleted Successfully";
    }


}
