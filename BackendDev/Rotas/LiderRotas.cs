using BackendDev.Infraestrutura.Data;
using BackendDev.Models.Usuario;
using Microsoft.EntityFrameworkCore;

namespace BackendDev.Rotas;

public static class LiderRotas
{
    public static void LiderRota(this WebApplication app)
    {
        var rota = app.MapGroup("userLiderRouteDev");

        // A verificação de tipo fica da parte do front ou back-end?
        rota.MapPatch("alocarMembro/{id}", async (Guid id, string tipoNovo, DbContextApp context) =>
        {
            var membro =
                await context.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.TipoMembro != Tipo_membro.Lider);
            membro.AtualizarTipoMembro(tipoNovo);
            
            await context.SaveChangesAsync();
            return Results.Ok(membro);
        });

    }
}