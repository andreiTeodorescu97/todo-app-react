using FastEndpoints;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Endpoints;

// DTOs moved into the endpoint class
public class UpdateTodoRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? CategoryId { get; set; }
    public bool? Completed { get; set; }
}

public class UpdateTodoEndpoint : Endpoint<UpdateTodoRequest, Todo>
{
    private readonly TodoService _todoService;

    public UpdateTodoEndpoint(TodoService todoService)
    {
        _todoService = todoService;
    }

    public override void Configure()
    {
        Patch("/todos/{id}");
        AllowAnonymous(); // Will be handled by middleware
    }

    public override async Task HandleAsync(UpdateTodoRequest req, CancellationToken ct)
    {
        var userId = HttpContext.Items["UserId"] as string;
        if (string.IsNullOrEmpty(userId))
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        var id = Route<string>("id");
        var updatedTodo = _todoService.UpdateTodo(id, userId, req);
        
        if (updatedTodo == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        await SendAsync(updatedTodo, cancellation: ct);
    }
}
