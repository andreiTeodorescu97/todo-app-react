using TodoApi.Models;
using TodoApi.Endpoints;

namespace TodoApi.Services;

public class TodoService
{
    private readonly List<Todo> _todos = new();

    public IEnumerable<Todo> GetTodosByUserId(string userId)
    {
        return _todos.Where(t => t.UserId == userId);
    }

    public Todo? GetTodoById(string id, string userId)
    {
        return _todos.FirstOrDefault(t => t.Id == id && t.UserId == userId);
    }

    public Todo CreateTodo(string userId, string name, string description, string categoryId)
    {
        var todo = new Todo
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            CategoryId = categoryId,
            Name = name,
            Description = description,
            DateAdded = DateTime.UtcNow,
            Completed = false,
            DateCompleted = null
        };

        _todos.Add(todo);
        return todo;
    }

    public Todo? UpdateTodo(string id, string userId, UpdateTodoRequest request)
    {
        var todo = GetTodoById(id, userId);
        if (todo == null) return null;

        if (request.Name != null) todo.Name = request.Name;
        if (request.Description != null) todo.Description = request.Description;
        if (request.CategoryId != null) todo.CategoryId = request.CategoryId;
        if (request.Completed.HasValue)
        {
            todo.Completed = request.Completed.Value;
            todo.DateCompleted = request.Completed.Value ? DateTime.UtcNow : null;
        }

        return todo;
    }

    public bool DeleteTodo(string id, string userId)
    {
        var todo = GetTodoById(id, userId);
        if (todo == null || todo.Completed) return false;

        return _todos.Remove(todo);
    }
}
