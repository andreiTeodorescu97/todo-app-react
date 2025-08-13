using TodoApi.Models;
using TodoApi.Endpoints;
using TodoApi.Data;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Services;

public class CategoryService
{
    private readonly TodoDbContext _context;

    public CategoryService(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(string id)
    {
        return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Category> CreateCategoryAsync(string name)
    {
        var category = new Category
        {
            Id = Guid.NewGuid().ToString(),
            Name = name,
            DateAdded = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category?> UpdateCategoryAsync(string id, UpdateCategoryRequest request)
    {
        var category = await GetCategoryByIdAsync(id);
        if (category == null) return null;

        if (request.Name != null) category.Name = request.Name;
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<bool> DeleteCategoryAsync(string id)
    {
        var category = await GetCategoryByIdAsync(id);
        if (category == null) return false;

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }
}
