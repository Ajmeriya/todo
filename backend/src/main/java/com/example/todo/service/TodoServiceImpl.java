package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.entity.TodoItem;
import com.example.todo.exception.TodoNotFoundException;
import com.example.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public List<TodoItem> findAll() {
        return todoRepository.findAll();
    }

    @Override
    public TodoItem findById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
    }

    @Override
    public TodoItem create(TodoRequest request) {
        LocalDateTime now = LocalDateTime.now();
        TodoItem todoItem = new TodoItem();
        todoItem.setTitle(request.getTitle());
        todoItem.setDescription(request.getDescription());
        todoItem.setCompleted(request.isCompleted());
        todoItem.setCreatedAt(now);
        todoItem.setUpdatedAt(now);
        return todoRepository.save(todoItem);
    }

    @Override
    public TodoItem update(Long id, TodoRequest request) {
        TodoItem todoItem = findById(id);
        todoItem.setTitle(request.getTitle());
        todoItem.setDescription(request.getDescription());
        todoItem.setCompleted(request.isCompleted());
        todoItem.setUpdatedAt(LocalDateTime.now());
        return todoRepository.save(todoItem);
    }

    @Override
    public void delete(Long id) {
        TodoItem todoItem = findById(id);
        todoRepository.delete(todoItem);
    }
}
