using BackendDev.Infraestrutura.Data;
using BackendDev.Models.Startup;
using BackendDev.Models.Usuario;
using Microsoft.EntityFrameworkCore;

namespace BackendDev.Rotas;

public static class StartupRotas
{
    public static void StartupRota(this WebApplication app)
    {
        var rota = app.MapGroup("startupRotaDev");
// TODO: MUDAR A CONEXÃO COM O BANCO DE DADOS USANDO A INTERFACE
        // Cadastro de Startup
        rota.MapPost("cadastro", async (StartupDto startupDto, DbContextApp context) =>
        {
            var startup = new Startup(startupDto);

            await context.Startups.AddAsync(startup);
            await context.SaveChangesAsync();
        });

        // Verificar se um usuário é líder da startup
        rota.MapGet("verificarLider/{id}", async (Guid id, Guid userId, DbContextApp context) =>
        {
            var startup = await context.Startups
                .Include(s => s.Membros) // Assumindo que você tem uma coleção de líderes na classe Startup
                .FirstOrDefaultAsync(s => s.Id == id && s.Ativo == true );
        
            if (startup == null) return Results.NotFound("Startup não encontrada");
    
            // Verificar se o usuário está na lista de líderes
            var isLeader = startup.Membros.Any(m => m.Id == userId && m.TipoMembro == Tipo_membro.Lider);

            return Results.Ok(new { isLeader });
        });
        
        // Busca todos as startups
        rota.MapGet("busca/", async (DbContextApp context) =>
        {
            var startups = await context.Startups.Where(s => s.Ativo == true)
                .Select(startup => new StartupRespostaDto(
                    startup.Nome,
                    startup.Descricao,
                    startup.Status,
                    startup.ModeloNegocio,
                    startup.Mvp,
                    startup.Cnpj,
                    startup.Jornadas
                ))
                .ToListAsync();

            return Results.Ok(startups);
        });

        rota.MapGet("exibirStartup/{id}", async (Guid id, DbContextApp context) =>
        {
            var startup = await context.Startups.Include(startup => startup.Membros)
                .FirstOrDefaultAsync(s => s.Id == id && s.Ativo == true);
            if (startup == null) return Results.NotFound();

            var StExibir = new StartupExibirDto(
                startup.Nome,
                startup.Descricao,
                startup.Membros,
                startup.Status.ToString(),
                startup.ModeloNegocio.ToString(),
                startup.Mvp,
                startup.Cnpj,
                startup.Jornadas.ToString()
            );

            return Results.Ok(StExibir);
        });

        //ADICIONAR MEMBRO
        rota.MapPatch("adicionar/{id}", async (DbContextApp context, Guid idUser, Guid idStartup) =>
        {
            var startup = await context.Startups.FirstOrDefaultAsync(u => u.Id == idStartup && u.Ativo == true);
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Id == idUser && u.EstaAtivo == true);

            if (startup == null) return Results.NotFound("Startup não encontrada");
            if (usuario == null) return Results.NotFound("Usuário não encontrado");

            
            
            startup.AdicionarMembro(usuario);
            await context.SaveChangesAsync();

            return Results.Ok(startup);
        });

        // REMOVER MEMBRO
        rota.MapPatch("remover/{id}", async (DbContextApp context, Guid idUser, Guid idStartup) =>
        {
            var startup = await context.Startups
                .Include(s => s.Membros)  // Adicione esta linha
                .FirstOrDefaultAsync(u => u.Id == idStartup && u.Ativo == true);
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Id == idUser && u.EstaAtivo == true);

            if (startup == null) return Results.NotFound("Startup não encontrada");
            if (usuario == null) return Results.NotFound("Usuário não encontrado");

            startup.RemoverMembro(usuario);
            await context.SaveChangesAsync();

            return Results.Ok(startup);
        });

        //ATUALIZAR STATUS, MODELO DE NEGOCIOS, JORNADAS, MUP, DESCRICÃO
        rota.MapPatch("atualizar/{id}", async (Guid id, StartupUpdateDto updateDto, DbContextApp context) =>
        {
            var startup = await context.Startups.FirstOrDefaultAsync(s => s.Id == id && s.Ativo);
            if (startup == null) return Results.NotFound("Startup não encontrada");

            if (updateDto.Status != null) startup.AtualizarStatus(updateDto.Status);
            if (updateDto.ModeloNegocio != null) startup.AtualizarModeloNegocio(updateDto.ModeloNegocio);
            if (updateDto.Jornadas != null) startup.AtualizarJornadas(updateDto.Jornadas);
            if (updateDto.Mvp.HasValue) startup.AtualizarMvp(updateDto.Mvp.Value);
            if (updateDto.Descricao != null) startup.AtualizarDescricao(updateDto.Descricao);
            if (updateDto.Cnpj != null) startup.AtualizarCnpj(updateDto.Cnpj);

            await context.SaveChangesAsync();
            return Results.Ok(startup);
        });
        
        // Deleta Statup
        rota.MapDelete("excluir/{id:guid}", async (Guid id, DbContextApp context) =>
        {
            var startup = await context.Startups.FirstOrDefaultAsync(u => u.Id == id);
            if (startup != null) context.Startups.Remove(startup);
            await context.SaveChangesAsync();
                    
            return Results.NoContent();
        });
    }
}