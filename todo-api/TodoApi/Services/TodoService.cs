using TodoApi.Models;
using TodoApi.Endpoints;
using TodoApi.Data;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Services;

public class TodoService
{
    private readonly TodoDbContext _context;

    public TodoService(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Todo>> GetTodosByUserIdAsync(string userId)
    {
        return await _context.Todos
            .Where(t => t.UserId == userId)
            .ToListAsync();
    }

    public async Task<Todo?> GetTodoByIdAsync(string id, string userId)
    {
        return await _context.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
    }

    public async Task<Todo> CreateTodoAsync(string userId, string name, string description, string categoryId)
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

        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();
        return todo;
    }

    public async Task<Todo?> UpdateTodoAsync(string id, string userId, UpdateTodoRequest request)
    {
        var todo = await GetTodoByIdAsync(id, userId);
        if (todo == null) return null;

        if (request.Name != null) todo.Name = request.Name;
        if (request.Description != null) todo.Description = request.Description;
        if (request.CategoryId != null) todo.CategoryId = request.CategoryId;
        if (request.Completed.HasValue)
        {
            todo.Completed = request.Completed.Value;
            todo.DateCompleted = request.Completed.Value ? DateTime.UtcNow : null;
        }

        await _context.SaveChangesAsync();
        return todo;
    }

    public async Task<bool> DeleteTodoAsync(string id, string userId)
    {
        var todo = await GetTodoByIdAsync(id, userId);
        if (todo == null || todo.Completed) return false;

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return true;
    }
}
