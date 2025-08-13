using TodoApi.Models;

namespace TodoApi.Services;

public class AuthService
{
    private readonly Dictionary<string, string> _tokens = new(); // token: userId
    private readonly List<User> _users = new()
    {
        new User { Id = "1", Username = "alice", Password = "password1" },
        new User { Id = "2", Username = "bob", Password = "password2" }
    };

    public string? AuthenticateUser(string username, string password)
    {
        var user = _users.FirstOrDefault(u => u.Username == username && u.Password == password);
        if (user == null) return null;

        var token = Guid.NewGuid().ToString();
        _tokens[token] = user.Id;
        return token;
    }

    public string? GetUserIdFromToken(string token)
    {
        return _tokens.TryGetValue(token, out var userId) ? userId : null;
    }

    public void Logout(string token)
    {
        _tokens.Remove(token);
    }
}
