using FastEndpoints;
using TodoApi.Services;

namespace TodoApi.Endpoints;

// DTOs moved into the endpoint class
public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public Guid Token { get; set; }
}

public class LoginEndpoint : Endpoint<LoginRequest, LoginResponse>
{
    private readonly AuthService _authService;

    public LoginEndpoint(AuthService authService)
    {
        _authService = authService;
    }

    public override void Configure()
    {
        Post("/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var token = await _authService.AuthenticateUserAsync(req.Username, req.Password);
        
        if (token == null)
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        await SendAsync(new LoginResponse { Token = token.Value }, cancellation: ct);
    }
}
