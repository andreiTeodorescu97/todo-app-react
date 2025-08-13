namespace TodoApi.Models;

public class Todo
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DateAdded { get; set; }
    public bool Completed { get; set; }
    public DateTime? DateCompleted { get; set; }
}
