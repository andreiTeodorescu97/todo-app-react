using TodoApi.Models;
using TodoApi.Endpoints;

namespace TodoApi.Services;

public class CategoryService
{
    private readonly List<Category> _categories = new()
    {
        new Category { Id = "cat1", Name = "Work", DateAdded = DateTime.UtcNow },
        new Category { Id = "cat2", Name = "Personal", DateAdded = DateTime.UtcNow }
    };

    public IEnumerable<Category> GetAllCategories()
    {
        return _categories;
    }

    public Category? GetCategoryById(string id)
    {
        return _categories.FirstOrDefault(c => c.Id == id);
    }

    public Category CreateCategory(string name)
    {
        var category = new Category
        {
            Id = Guid.NewGuid().ToString(),
            Name = name,
            DateAdded = DateTime.UtcNow
        };

        _categories.Add(category);
        return category;
    }

    public Category? UpdateCategory(string id, UpdateCategoryRequest request)
    {
        var category = GetCategoryById(id);
        if (category == null) return null;

        if (request.Name != null) category.Name = request.Name;
        return category;
    }

    public bool DeleteCategory(string id)
    {
        var category = GetCategoryById(id);
        if (category == null) return false;

        return _categories.Remove(category);
    }
}
