using FastEndpoints;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Endpoints;

// DTOs moved into the endpoint class
public class UpdateCategoryRequest
{
    public string? Name { get; set; }
}

public class UpdateCategoryEndpoint : Endpoint<UpdateCategoryRequest, Category>
{
    private readonly CategoryService _categoryService;

    public UpdateCategoryEndpoint(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public override void Configure()
    {
        Patch("/categories/{id}");
        AllowAnonymous(); // Will be handled by middleware
    }

    public override async Task HandleAsync(UpdateCategoryRequest req, CancellationToken ct)
    {
        var id = Route<string>("id");
        var updatedCategory = _categoryService.UpdateCategory(id, req);
        
        if (updatedCategory == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        await SendAsync(updatedCategory, cancellation: ct);
    }
}
