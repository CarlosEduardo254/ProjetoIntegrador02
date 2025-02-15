using BackendDev.Models.Startup;

public interface IStartupRepository
{
    // Operações básicas
    Task<Startup?> ObterPorIdAsync(Guid id);
    Task<List<Startup>> ObterTodosAsync();
    Task<Startup> AdicionarAsync(Startup startup);
    Task AtualizarAsync(Startup startup);
    Task DeletarAsync(Guid id);
    
    // Operações específicas para lucros
    Task<List<Lucro>> ObterLucrosPorStartupAsync(Guid startupId);
    Task<decimal> ObterLucroTotalAsync(Guid startupId);
    Task<List<Lucro>> ObterLucrosPorPeriodoAsync(Guid startupId, DateTime inicio, DateTime fim);
    
    // Operações específicas para atualizações
    Task<List<AtualizacaoStartup>> ObterAtualizacoesPorStartupAsync(Guid startupId);
    Task<List<AtualizacaoStartup>> ObterAtualizacoesPorPeriodoAsync(Guid startupId, DateTime inicio, DateTime fim);
}