using BackendDev.Models.Usuario;
using BackendDev.Servicos;
using Microsoft.AspNetCore.Mvc;

namespace BackendDev.Rotas;

public static class AuthRota
{
    public static void AuthRotas(this WebApplication app)
    {
        
        var rota = app.MapGroup("auth");
        rota.MapPost("login", async ([FromBody] LoginDto loginDto, [FromServices] Auth auth) =>
        {
            var tokens = await auth.ValidateCredentials(loginDto.email, loginDto.senha);
        
            if (tokens == null)
                return Results.Unauthorized();
            
            return Results.Ok(tokens);
        });

        // Rota para renovar o token
        rota.MapPost("refresh-token", async (
            [FromBody] string refreshToken, 
            [FromServices] Auth auth) =>
        {
            var tokens = await auth.RefreshToken(refreshToken);
        
            if (tokens == null)
                return Results.Unauthorized();
            
            return Results.Ok(tokens);
        });

    }
    
}