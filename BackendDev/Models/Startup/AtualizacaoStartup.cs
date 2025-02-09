namespace BackendDev.Models.Startup;

public class AtualizacaoStartup
{
    public Guid Id { get; init; }
    public Guid StartupId { get; init; }
    public DateTime DataAtualizacao { get; private set; }
    public string Descricao { get; private set; }
    public string TipoAtualizacao { get; private set; }

    public AtualizacaoStartup(Guid startupId, string descricao, string tipoAtualizacao)
    {
        Id = Guid.NewGuid();
        StartupId = startupId;
        DataAtualizacao = DateTime.Now;
        Descricao = descricao;
        TipoAtualizacao = tipoAtualizacao;
    }
}