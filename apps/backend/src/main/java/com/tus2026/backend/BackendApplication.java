package com.tus2026.backend;

import com.tus2026.backend.Models.Status;
import com.tus2026.backend.Models.Task;
import com.tus2026.backend.Models.TaskDifficulty;
import com.tus2026.backend.Repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.util.List;
import java.util.Scanner;

@EnableMongoAuditing
@SpringBootApplication
public class BackendApplication{

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }


    //Console test for basic CRUD Operations with Tasks
        @Bean
        public CommandLineRunner run(TaskRepository repo) {
            return args -> {

                Scanner scanner = new Scanner(System.in);
                int choice = -1;

            while (choice != 0) {
                System.out.println("\n===== TASK CRUD MENU =====");
                System.out.println("1. Add Task");
                System.out.println("2. Show All Tasks");
                System.out.println("3. Find Task by Name");
                System.out.println("4. Delete Task");
                System.out.println("0. Exit");
                System.out.print("Enter choice: ");

                choice = Integer.parseInt(scanner.nextLine());

                switch (choice) {

                    case 1:
                        Task t = new Task();
                        System.out.print("Task name: ");
                        t.setTaskName(scanner.nextLine());

                        System.out.print("Difficulty (EASY, MEDIUM, HARD): ");
                        t.setDifficulty(TaskDifficulty.valueOf(scanner.nextLine().toLowerCase()));

                        System.out.print("Description: ");
                        t.setTaskDesc(scanner.nextLine());

                        System.out.print("Assignee ID: ");
                        t.setAssigneeId(scanner.nextLine());

                        System.out.print("Effort: ");
                        t.setEffort(Integer.parseInt(scanner.nextLine()));

                        t.setStatus(Status.TODO);

                        repo.save(t);
                        System.out.println("Saved!");
                        break;

                    case 2:
                        repo.findAll().forEach(System.out::println);
                        break;

                    case 3:
                        System.out.print("Enter task name: ");
                        String name = scanner.nextLine();
                        List<Task> found = repo.findByTaskNameContainingIgnoreCase(name);

                        if (!found.isEmpty()) {
                            found.forEach(System.out::println);
                        } else {
                            System.out.println("Not found.");
                        }
                        break;

                    case 4:
                        System.out.print("Enter task ID to delete: ");
                        String id = scanner.nextLine();
                        repo.deleteById(id);
                        System.out.println("Deleted!");
                        break;

                    case 0:
                        System.out.println("Goodbye!");
                        break;

                    default:
                        System.out.println("Invalid choice.");
                }
            }
        };
    }
}
