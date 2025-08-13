using TodoApi.Services;

namespace TodoApi.Middleware;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly AuthService _authService;

    public AuthMiddleware(RequestDelegate next, AuthService authService)
    {
        _next = next;
        _authService = authService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip authentication for login endpoint
        if (context.Request.Path.StartsWithSegments("/login"))
        {
            await _next(context);
            return;
        }

        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { error = "No token provided" });
            return;
        }

        var token = authHeader.Replace("Bearer ", "");
        var userId = _authService.GetUserIdFromToken(token);
        
        if (string.IsNullOrEmpty(userId))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { error = "Invalid token" });
            return;
        }

        // Add userId to the context so endpoints can access it
        context.Items["UserId"] = userId;
        await _next(context);
    }
}
