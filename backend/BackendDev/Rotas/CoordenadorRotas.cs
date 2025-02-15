using BackendDev.Infraestrutura.Data;
using BackendDev.Models.Coordenador;
using BackendDev.Models.Usuario;
using Microsoft.EntityFrameworkCore;

namespace BackendDev.Rotas;

public static class CoordenadorRotas
{
    public static void CoordenadorRota(this WebApplication app)
    {
        var rota = app.MapGroup("coordRouteDev");
        
        // Cadastro
        rota.MapPost("cadastro", async (CoordenadorDto coordenadorDto, DbContextApp context) =>
        {
            var coordenador = new Coordenador(coordenadorDto);
            
            await context.Coordenadores.AddAsync(coordenador);
            await context.SaveChangesAsync();
        });
        
        // ADICIONAR USUARIO LIDER DA STARTUP
        rota.MapPatch("adicionadCoordenado",
            async (Guid idCoordenador, string nomeCoordenado, DbContextApp context) =>
            {
                var coordenador = await context.Coordenadores.FindAsync(idCoordenador);
                var usuarioCoordenado = await context.Usuarios.FirstOrDefaultAsync(u =>
                    u.Nome == nomeCoordenado && u.TipoMembro == Tipo_membro.Lider);
                
                if (usuarioCoordenado == null)
                {
                    return Results.NotFound();
                }

                coordenador?.AdicionarUsuarioCoordenado(usuarioCoordenado.Id);
                await context.SaveChangesAsync();
                
                return Results.Ok(coordenador);
            });
        // Atualizar características
        rota.MapPatch("atualizar/{id}", async (Guid id, CoordUpdateDto updateDto, DbContextApp context) =>
        {
            var coordenador = await context.Coordenadores.FindAsync(id);
            if (coordenador == null) return Results.NotFound();
            
            // Fazendo atualizações
            if (updateDto.Email != null) coordenador.AtualizarEmail(updateDto.Email);
            if (updateDto.Senha != null) coordenador.AtualizarSenha(updateDto.Senha);
            if (updateDto.Contato != null) coordenador.AtualizarContato(updateDto.Contato);
            
            await context.SaveChangesAsync();
            return Results.Ok(coordenador);
        }).RequireAuthorization();
        
        // Desativar Coordenador
        rota.MapDelete("desativar/{id:guid}", async (Guid id, DbContextApp context) =>
        {
            var coordenador = await context.Coordenadores.FirstOrDefaultAsync(u => u.Id == id);
            coordenador?.DesativarCoordenador();
            await context.SaveChangesAsync();
                    
            return Results.NoContent();
        }).RequireAuthorization();
        
        // Deleta Coordenador
        rota.MapDelete("excluir/{id:guid}", async (Guid id, DbContextApp context) =>
        {
            var coordenador = await context.Coordenadores.FirstOrDefaultAsync(u => u.Id == id);
            if (coordenador != null) context.Coordenadores.Remove(coordenador);
            await context.SaveChangesAsync();
                    
            return Results.NoContent();
        }).RequireAuthorization();


    } 
}