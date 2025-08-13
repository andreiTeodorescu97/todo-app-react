using FastEndpoints;
using TodoApi.Services;

namespace TodoApi.Endpoints;

public class LogoutEndpoint : EndpointWithoutRequest
{
    private readonly AuthService _authService;

    public LogoutEndpoint(AuthService authService)
    {
        _authService = authService;
    }

    public override void Configure()
    {
        Post("/logout");
        AllowAnonymous(); // Will be handled by middleware
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
        
        if (!string.IsNullOrEmpty(token))
        {
            await _authService.Logout(new Guid(token));
        }

        await SendOkAsync(new { message = "Logged out" }, ct);
    }
}
