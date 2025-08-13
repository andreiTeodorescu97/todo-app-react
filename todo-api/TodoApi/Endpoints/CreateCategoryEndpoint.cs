using FastEndpoints;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Endpoints;

// DTOs moved into the endpoint class
public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
}

public class CreateCategoryEndpoint : Endpoint<CreateCategoryRequest, Category>
{
    private readonly CategoryService _categoryService;

    public CreateCategoryEndpoint(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public override void Configure()
    {
        Post("/categories");
        AllowAnonymous(); // Will be handled by middleware
    }

    public override async Task HandleAsync(CreateCategoryRequest req, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(req.Name))
        {
            AddError(r => r.Name, "Name is required");
            await SendErrorsAsync(400, ct);
            return;
        }

        var category = await _categoryService.CreateCategoryAsync(req.Name);
        await SendAsync(category, 201, cancellation: ct);
    }
}
