using FastEndpoints;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Endpoints;

public class GetCategoriesEndpoint : EndpointWithoutRequest<IEnumerable<Category>>
{
    private readonly CategoryService _categoryService;

    public GetCategoriesEndpoint(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public override void Configure()
    {
        Get("/categories");
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

        var categories = await _categoryService.GetAllCategoriesAsync();
        await SendAsync(categories, cancellation: ct);
    }
}
