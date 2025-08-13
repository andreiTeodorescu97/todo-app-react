using FastEndpoints;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Endpoints;

// DTOs moved into the endpoint class
public class CreateTodoRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
}

public class CreateTodoEndpoint : Endpoint<CreateTodoRequest, Todo>
{
    private readonly TodoService _todoService;

    public CreateTodoEndpoint(TodoService todoService)
    {
        _todoService = todoService;
    }

    public override void Configure()
    {
        Post("/todos");
        AllowAnonymous(); // Will be handled by middleware
    }

    public override async Task HandleAsync(CreateTodoRequest req, CancellationToken ct)
    {
        var userId = HttpContext.Items["UserId"] as string;
        if (string.IsNullOrEmpty(userId))
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        var todo = _todoService.CreateTodo(userId, req.Name, req.Description, req.CategoryId);
        await SendAsync(todo, 201, cancellation: ct);
    }
}
