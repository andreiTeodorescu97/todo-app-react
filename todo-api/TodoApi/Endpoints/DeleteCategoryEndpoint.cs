using FastEndpoints;
using TodoApi.Services;

namespace TodoApi.Endpoints;

public class DeleteCategoryEndpoint : EndpointWithoutRequest
{
    private readonly CategoryService _categoryService;

    public DeleteCategoryEndpoint(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public override void Configure()
    {
        Delete("/categories/{id}");
        AllowAnonymous(); // Will be handled by middleware
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var id = Route<string>("id");
        var deleted = await _categoryService.DeleteCategoryAsync(id);
        
        if (!deleted)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        await SendOkAsync(new { id, message = "Category deleted" }, ct);
    }
}
