namespace BackendDev.Models.Startup;

public partial class Startup
{
    public List<Lucro> Lucros { get; private set; } = new();
    public List<AtualizacaoStartup> Atualizacoes { get; private set; } = new();

    public void RegistrarLucro(decimal valor)
    {
        var lucro = new Lucro(Id, valor);
        Lucros.Add(lucro);
    }

    public void RegistrarAtualizacao(string descricao, string tipoAtualizacao)
    {
        var atualizacao = new AtualizacaoStartup(Id, descricao, tipoAtualizacao);
        Atualizacoes.Add(atualizacao);
    }
}
