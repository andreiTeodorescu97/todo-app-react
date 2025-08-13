using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data;

public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Todo> Todos { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Password).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Token);
            entity.HasIndex(e => e.Username).IsUnique();
        });

        // Configure Todo entity
        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.DateAdded).IsRequired();
            entity.Property(e => e.Completed).IsRequired();
            
            // Configure relationships
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne<Category>()
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Category entity
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DateAdded).IsRequired();
        });

        // Seed initial data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User { Id = "1", Username = "alice", Password = "password1" },
            new User { Id = "2", Username = "bob", Password = "password2" }
        );

        // Seed Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = "1", Name = "Work", DateAdded = new DateTime(2024, 7, 14) },
            new Category { Id = "2", Name = "Personal", DateAdded = new DateTime(2024, 7, 19) },
            new Category { Id = "3", Name = "Shopping", DateAdded = new DateTime(2024, 7, 24) }
        );

        // Seed Todos
        modelBuilder.Entity<Todo>().HasData(
            new Todo 
            { 
                Id = "1", 
                UserId = "1", 
                CategoryId = "1", 
                Name = "Complete project proposal", 
                Description = "Finish the quarterly project proposal document", 
                DateAdded = new DateTime(2024, 7, 29), 
                Completed = false 
            },
            new Todo 
            { 
                Id = "2", 
                UserId = "1", 
                CategoryId = "2", 
                Name = "Call dentist", 
                Description = "Schedule annual dental checkup", 
                DateAdded = new DateTime(2024, 8, 3), 
                Completed = true,
                DateCompleted = new DateTime(2024, 8, 8)
            },
            new Todo 
            { 
                Id = "3", 
                UserId = "2", 
                CategoryId = "3", 
                Name = "Buy groceries", 
                Description = "Get items for the week", 
                DateAdded = new DateTime(2024, 8, 6), 
                Completed = false 
            }
        );
    }
}
