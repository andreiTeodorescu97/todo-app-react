using Microsoft.EntityFrameworkCore;
using TodoApi.Data;

namespace TodoApi.Services;

public class AuthService
{
    private readonly Dictionary<string, string> _tokens = new(); // token: userId
    private readonly TodoDbContext _context;

    public AuthService(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<Guid?> AuthenticateUserAsync(string username, string password)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
        
        if (user == null) return null;

        var token = Guid.NewGuid();
        user.Token = token;
        return token;
    }

    public async Task<string?> GetUserIdFromToken(Guid token)
    {
        return (await _context.Users.FirstOrDefaultAsync(c => c.Token == token))?.Id;
    }

    public async Task Logout(Guid token)
    {
        var user = await _context.Users.FirstOrDefaultAsync(c => c.Token == token);
        if (user == null) return;
        user.Token = null;
        await _context.SaveChangesAsync();
    }
}
