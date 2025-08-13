using FastEndpoints;
using TodoApi.Services;

namespace TodoApi.Endpoints;

public class DeleteTodoEndpoint : EndpointWithoutRequest
{
    private readonly TodoService _todoService;

    public DeleteTodoEndpoint(TodoService todoService)
    {
        _todoService = todoService;
    }

    public override void Configure()
    {
        Delete("/todos/{id}");
        AllowAnonymous(); // Will be handled by middleware
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = HttpContext.Items["UserId"] as string;
        if (string.IsNullOrEmpty(userId))
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        var id = Route<string>("id");
        var deleted = _todoService.DeleteTodo(id, userId);
        
        if (!deleted)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        await SendOkAsync(new { id, message = "Todo deleted" }, ct);
    }
}
