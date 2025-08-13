using FastEndpoints;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Endpoints;

public class GetTodosEndpoint : EndpointWithoutRequest<IEnumerable<Todo>>
{
    private readonly TodoService _todoService;

    public GetTodosEndpoint(TodoService todoService)
    {
        _todoService = todoService;
    }

    public override void Configure()
    {
        Get("/todos");
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

        var todos = await _todoService.GetTodosByUserIdAsync(userId);
        await SendAsync(todos, cancellation: ct);
    }
}
