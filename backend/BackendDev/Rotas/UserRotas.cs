using System.Security.Claims;
using BackendDev.Infraestrutura.Data;
using BackendDev.Models.Usuario;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendDev.Rotas;

public static class UserRotas
{
    public static void UserRota(this WebApplication app)
    {
        var rota = app.MapGroup("userRouteDev");
        
        // Cadastro
        rota.MapPost("cadastro", async (UsuarioDTO userDto, DbContextApp context) =>
        {
            var usuario = new Usuario(userDto);
            await context.Usuarios.AddAsync(usuario);
            await context.SaveChangesAsync();
    
            // Retorna um objeto JSON
            return Results.Created("", new { 
                success = true,
                message = "Usuário cadastrado com sucesso" 
            });
        });

        rota.MapGet("user/profile/{id}", async (HttpContext httpContext, DbContextApp context, Guid id) =>
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
            if (usuario == null) return Results.NotFound();


            // Mapear os dados do usuário para o UserUpdateDto
            var userDto = new UserUpdateDto(
                nome: usuario.Nome,
                email: usuario.Email,
                senha: null, // Não retornamos a senha por segurança
                contato: usuario.Contato,
                tipo_membro: usuario.TipoMembro.ToString() // Ajuste conforme o nome do campo no modelo
            );

            return Results.Ok(userDto);
        });
        
        // Atualizar perfil
        rota.MapPut("profile/update", async (HttpContext httpContext, UserUpdateDto updateDto, DbContextApp context) =>
        {
            var userId = httpContext.User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

            var usuario = await context.Usuarios.FindAsync(Guid.Parse(userId));
            if (usuario == null) return Results.NotFound();

            if (updateDto.nome != null) usuario.AtualizarNome(updateDto.nome);
            if (updateDto.email != null) usuario.AtualizarEmail(updateDto.email);
            if (updateDto.contato != null) usuario.AtualizarContato(updateDto.contato);
            if (updateDto.senha != null) usuario.AtualizarSenha(updateDto.senha);

            await context.SaveChangesAsync();
            return Results.Ok(new { success = true, message = "Perfil atualizado" });
        });
        
        // Busca todos os usuários
        rota.MapGet("busca/", async (DbContextApp context) =>
        {
            var usuarios = await context.Usuarios.Where(u => u.EstaAtivo == true)
                .Select(user => new UserRespostaDto(
                    user.Nome,
                    user.Email,
                    user.Contato,
                    user.TipoMembro
                    ))
                .ToListAsync();
            
            return Results.Ok(usuarios);
        });
        
        // Busca pelo nome do Usuário
        rota.MapGet("busca/{nome}",  async (
            string nome,
            [FromServices] DbContextApp db) =>
        {
            var usuarios = await db.Usuarios
                .Where(u => u.Nome == nome && u.EstaAtivo == true)
                .ToListAsync();

            return usuarios.Count == 0 ? Results.NotFound("Nenhum usuário encontrado com este nome.") : Results.Ok(usuarios);
        });
        
        
        // Atualizar característica
        rota.MapPatch("atualizar/{id}", async (Guid id, UserUpdateDto updateDto, DbContextApp context) =>
        {
            var usuario = await context.Usuarios.FindAsync(id);
            if(usuario == null) return Results.NotFound();
            
            // Fazendo a atualização
            if (updateDto.nome != null) usuario.AtualizarNome(updateDto.nome);
            if (updateDto.email != null) usuario.AtualizarEmail(updateDto.email);
            if (updateDto.contato != null) usuario.AtualizarContato(updateDto.contato);
            if (updateDto.senha != null) usuario.AtualizarSenha(updateDto.senha);
            if (updateDto.tipo_membro != null) usuario.AtualizarTipoMembro(updateDto.tipo_membro);
            
            await context.SaveChangesAsync();
            return Results.Ok(usuario);
        });
        
        
        // Desativar Usuário
        rota.MapDelete("desativar/{id:guid}", async (Guid id, DbContextApp context) =>
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
            usuario?.DesativarConta();
            await context.SaveChangesAsync();
                    
            return Results.NoContent();
        });
        
        // Deleta Usuário
        rota.MapDelete("excluir/{id:guid}", async (Guid id, DbContextApp context) =>
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
            if (usuario != null) context.Usuarios.Remove(usuario);
            await context.SaveChangesAsync();
                    
            return Results.NoContent();
        });

    }
}