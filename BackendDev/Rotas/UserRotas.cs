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
        }).RequireAuthorization();
        
        // Busca pelo nome do Usuário
        rota.MapGet("busca/{nome}",  async (
            string nome,
            [FromServices] DbContextApp db) =>
        {
            var usuarios = await db.Usuarios
                .Where(u => u.Nome == nome && u.EstaAtivo == true)
                .ToListAsync();

            return usuarios.Count == 0 ? Results.NotFound("Nenhum usuário encontrado com este nome.") : Results.Ok(usuarios);
        }).RequireAuthorization();
        
        
        // Atualizar característica
        rota.MapPatch("atualizar/{id}", async (Guid id, UserUpdateDto updateDto, DbContextApp context) =>
        {
            var usuario = await context.Usuarios.FindAsync(id);
            if(usuario == null) return Results.NotFound();
            
            // Fazendo a atualização
            if (updateDto.email != null) usuario.AtualizarEmail(updateDto.email);
            if (updateDto.contato != null) usuario.AtualizarContato(updateDto.contato);
            if (updateDto.senha != null) usuario.AtualizarSenha(updateDto.senha);
            if (updateDto.tipo_membro != null) usuario.AtualizarTipoMembro(updateDto.tipo_membro);
            
            await context.SaveChangesAsync();
            return Results.Ok(usuario);
        }).RequireAuthorization();
        
        
        // Desativar Usuário
        rota.MapDelete("desativar/{id:guid}", async (Guid id, DbContextApp context) =>
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
            usuario?.DesativarConta();
            await context.SaveChangesAsync();
                    
            return Results.NoContent();
        }).RequireAuthorization();
        
        // Deleta Usuário
        rota.MapDelete("excluir/{id:guid}", async (Guid id, DbContextApp context) =>
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
            if (usuario != null) context.Usuarios.Remove(usuario);
            await context.SaveChangesAsync();
                    
            return Results.NoContent();
        }).RequireAuthorization();

    }
}