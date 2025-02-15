using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackendDev.Infraestrutura.Data;
using BackendDev.Infraestrutura.Token;
using BackendDev.Models.Usuario;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BackendDev.Servicos;

public class Auth
{
    private readonly DbContextApp _context;
    private readonly IConfiguration _configuration;
    public Auth(DbContextApp context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

     public async Task<TokenModel?> ValidateCredentials(string email, string senha)
    {
        var user = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || user.Senha != senha) // TODO: use hash da senha
            return null;

        var token = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();

        user.SetRefreshToken(refreshToken);
        await _context.SaveChangesAsync();

        return new TokenModel(token, refreshToken.Token);
    }

    private string GenerateAccessToken(Usuario usuario)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.TipoMembro.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1), // Token expira em 1 hora
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private RefreshToken GenerateRefreshToken()
    {
        return new RefreshToken
        {
            ExpiryTime = DateTime.UtcNow.AddHours(1) // Refresh token dura 1 horas
        };
    }

    public async Task<TokenModel?> RefreshToken(string refreshToken)
    {
        var user = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return null;

        var newAccessToken = GenerateAccessToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.SetRefreshToken(newRefreshToken);
        await _context.SaveChangesAsync();

        return new TokenModel(newAccessToken, newRefreshToken.Token);
    }
}