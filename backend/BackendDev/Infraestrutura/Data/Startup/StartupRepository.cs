using BackendDev.Infraestrutura.Data;
using BackendDev.Models.Startup;
using Microsoft.EntityFrameworkCore;

public class StartupRepository : IStartupRepository
{
    private readonly DbContextApp _context;

    public StartupRepository(DbContextApp context)
    {
        _context = context;
    }

    public async Task<Startup?> ObterPorIdAsync(Guid id)
    {
        return await _context.Startups
            .Include(s => s.Membros)
            .Include(s => s.Lucros)
            .Include(s => s.Atualizacoes)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<Startup>> ObterTodosAsync()
    {
        return await _context.Startups
            .Include(s => s.Membros)
            .Include(s => s.Lucros)
            .Include(s => s.Atualizacoes)
            .ToListAsync();
    }

    public async Task<Startup> AdicionarAsync(Startup startup)
    {
        await _context.Startups.AddAsync(startup);
        await _context.SaveChangesAsync();
        return startup;
    }

    public async Task AtualizarAsync(Startup startup)
    {
        _context.Entry(startup).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeletarAsync(Guid id)
    {
        var startup = await _context.Startups.FindAsync(id);
        if (startup != null)
        {
            _context.Startups.Remove(startup);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Lucro>> ObterLucrosPorStartupAsync(Guid startupId)
    {
        return await _context.LucrosMensais
            .Where(l => l.StartupId == startupId)
            .OrderBy(l => l.Data)
            .ToListAsync();
    }

    public async Task<decimal> ObterLucroTotalAsync(Guid startupId)
    {
        return await _context.LucrosMensais
            .Where(l => l.StartupId == startupId)
            .SumAsync(l => l.Valor);
    }

    public async Task<List<Lucro>> ObterLucrosPorPeriodoAsync(Guid startupId, DateTime inicio, DateTime fim)
    {
        return await _context.LucrosMensais
            .Where(l => l.StartupId == startupId && l.Data >= inicio && l.Data <= fim)
            .OrderBy(l => l.Data)
            .ToListAsync();
    }

    public async Task<List<AtualizacaoStartup>> ObterAtualizacoesPorStartupAsync(Guid startupId)
    {
        return await _context.AtualizacoesStartup
            .Where(a => a.StartupId == startupId)
            .OrderByDescending(a => a.DataAtualizacao)
            .ToListAsync();
    }

    public async Task<List<AtualizacaoStartup>> ObterAtualizacoesPorPeriodoAsync(Guid startupId, DateTime inicio, DateTime fim)
    {
        return await _context.AtualizacoesStartup
            .Where(a => a.StartupId == startupId && a.DataAtualizacao >= inicio && a.DataAtualizacao <= fim)
            .OrderByDescending(a => a.DataAtualizacao)
            .ToListAsync();
    }
}