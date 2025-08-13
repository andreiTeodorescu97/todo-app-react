using TodoApi.Services;

namespace TodoApi.Middleware;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IServiceScopeFactory _scopeFactory;

    public AuthMiddleware(RequestDelegate next, IServiceScopeFactory scopeFactory)
    {
        _next = next;
        _scopeFactory = scopeFactory;
    }

    public async Task InvokeAsync(HttpContext context)
    {
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
        using var scope = _scopeFactory.CreateScope();
        var authService = scope.ServiceProvider.GetRequiredService<AuthService>();
        var userId = await authService.GetUserIdFromToken(new Guid(token));

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