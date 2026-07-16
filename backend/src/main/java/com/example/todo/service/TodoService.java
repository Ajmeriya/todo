package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.entity.TodoItem;

import java.util.List;

public interface TodoService {

    List<TodoItem> findAll();

    TodoItem findById(Long id);

    TodoItem create(TodoRequest request);

    TodoItem update(Long id, TodoRequest request);

    void delete(Long id);
}
