using BackendDev.Models.Startup;

public static class StartupAnalyticsEndpoints
{
    public static void MapStartupAnalyticsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/startups");

        // Obter lucros de uma startup
        group.MapGet("/{id}/lucros", async (Guid id, IStartupRepository repository) =>
        {
            var startup = await repository.ObterPorIdAsync(id);
            if (startup == null) return Results.NotFound();

            var lucrosPorMes = startup.Lucros
                .GroupBy(l => new { l.Data.Year, l.Data.Month })
                .Select(g => new
                {
                    Data = $"{g.Key.Year}-{g.Key.Month}",
                    Valor = g.Sum(l => l.Valor)
                })
                .OrderBy(l => l.Data)
                .ToList();

            var lucroTotal = startup.Lucros.Sum(l => l.Valor);

            return Results.Ok(new
            {
                LucroTotal = lucroTotal,
                LucrosMensais = lucrosPorMes
            });
        })
        .WithName("ObterLucrosStartup")
        .WithOpenApi();

        // Obter atualizações de uma startup
        group.MapGet("/{id}/atualizacoes", async (Guid id, IStartupRepository repository) =>
        {
            var startup = await repository.ObterPorIdAsync(id);
            if (startup == null) return Results.NotFound();

            var atualizacoesPorMes = startup.Atualizacoes
                .GroupBy(a => new { a.DataAtualizacao.Year, a.DataAtualizacao.Month })
                .Select(g => new
                {
                    Data = $"{g.Key.Year}-{g.Key.Month}",
                    Quantidade = g.Count()
                })
                .OrderBy(a => a.Data)
                .ToList();

            return Results.Ok(atualizacoesPorMes);
        })
        .WithName("ObterAtualizacoesStartup")
        .WithOpenApi();

        // Registrar novo lucro
        group.MapPost("/{id}/lucros", async (Guid id, decimal valor, IStartupRepository repository) =>
        {
            var startup = await repository.ObterPorIdAsync(id);
            if (startup == null) return Results.NotFound();

            startup.RegistrarLucro(valor);
            await repository.AtualizarAsync(startup);

            return Results.Ok();
        })
        .WithName("RegistrarLucroStartup")
        .WithOpenApi();

        // Registrar nova atualização
        group.MapPost("/{id}/atualizacoes", async (Guid id, AtualizacaoDto dto, IStartupRepository repository) =>
        {
            var startup = await repository.ObterPorIdAsync(id);
            if (startup == null) return Results.NotFound();

            startup.RegistrarAtualizacao(dto.Descricao, dto.TipoAtualizacao);
            await repository.AtualizarAsync(startup);

            return Results.Ok();
        })
        .WithName("RegistrarAtualizacaoStartup")
        .WithOpenApi();
    }
}