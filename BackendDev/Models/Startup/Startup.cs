using BackendDev.Models.Usuario;

namespace BackendDev.Models.Startup;

public partial class Startup
{
    public Guid Id { get; init; }
    public string Nome { get; private set; }
    public string Descricao { get; private set; }
    public List<Usuario.Usuario>? Membros { get; private set; } = new();
    public StatusStartup Status { get; private set; }
    public ModeloDeNegocio ModeloNegocio { get; private set; }
    public bool Mvp { get; private set; }
    public string Cnpj { get; private set; }
    public Jornada Jornadas { get; private set; }
    public bool Ativo { get; private set; }

    public Startup(
        string nome,
        string descricao,
        List<Usuario.Usuario> membros,
        string contatosMembros,
        StatusStartup statusStartup,
        ModeloDeNegocio modeloNegocio,
        bool mvp,
        string cnpj,
        Jornada jornadas)
    {
        Id = Guid.NewGuid();
        Nome = nome ?? throw new ArgumentNullException(nameof(nome));
        Descricao = descricao ?? throw new ArgumentNullException(nameof(descricao));
        Membros = membros;
        Status = statusStartup;
        ModeloNegocio = modeloNegocio;
        Mvp = mvp;
        Cnpj = cnpj ?? throw new ArgumentNullException(nameof(cnpj));
        Jornadas = jornadas;
        Ativo = true;
    }

// TODO: ADICIONAR VERIFICAÇÃO NO CNPJ
    public Startup()
    {
    }

    public Startup(StartupDto startupDto)
    {
        Id = Guid.NewGuid();
        Nome = startupDto.Nome ?? throw new ArgumentNullException(nameof(startupDto.Nome));
        Descricao = startupDto.Descricao ?? throw new ArgumentNullException(nameof(startupDto.Descricao));
        Membros = new List<Usuario.Usuario>();
        
        // Definindo o Status
        try
        {
            Status = Enum.Parse<StatusStartup>(startupDto.Status, true);
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException("Valor inválido para Status.", ex); // Lança uma exceção
        }
        
        // Definindo o Modelo de Negócio
        try
        {
            ModeloNegocio = Enum.Parse<ModeloDeNegocio>(startupDto.ModeloNegocio, true);
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException("Valor inválido para o Modelo de Negócio.", ex); // Lança uma exceção
        }
        
        Mvp = startupDto.Mvp;
        Cnpj = startupDto.Cnpj ?? throw new ArgumentNullException(nameof(startupDto.Cnpj));
        
        // Definindo a Jornada
        try
        {
            Jornadas = Enum.Parse<Jornada>(startupDto.Jornadas, true);
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException("Valor inválido para Jornadas.", ex); // Lança uma exceção
        }

        Ativo = true;
    }

    public void AtualizarDescricao(string descricao)
    {
        Descricao = descricao ?? throw new ArgumentNullException(nameof(descricao));
    }

    public void AtualizarStatus(string status)
    {
        try
        {
            Status = Enum.Parse<StatusStartup>(status, true);
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException("Valor inválido para Status.", ex); // Lança uma exceção
        }    }

    public void AtualizarModeloNegocio(string modeloNegocio)
    {
        try
        {
            ModeloNegocio = Enum.Parse<ModeloDeNegocio>(modeloNegocio, true);
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException("Valor inválido para o Modelo de Negócio.", ex); // Lança uma exceção
        }
    }

    public void AtualizarJornadas(string jornadas)
    {
        try
        {
            Jornadas = Enum.Parse<Jornada>(jornadas, true);
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException("Valor inválido para Jornadas.", ex); // Lança uma exceção
        }
    }

    public void AtualizarMvp(bool mvp)
    {
        Mvp = mvp;
    }
    public void AtualizarCnpj(string cnpj)
    {
        Cnpj = cnpj ?? throw new ArgumentNullException(nameof(cnpj));
    }

    public List<Usuario.Usuario>? ListarMembros()
    {
        return Membros;
    }
    public void AdicionarMembro(Usuario.Usuario membro)
    {
        if (membro == null) throw new ArgumentNullException(nameof(membro));
        if (Membros != null && Membros.Contains(membro)) throw new InvalidOperationException("O membro já está na Startup");

        Membros?.Add(membro);
    }

    
    public void RemoverMembro(Usuario.Usuario membro)
    {
        if (membro == null) throw new ArgumentNullException(nameof(membro));
        if(Membros == null || Membros.Count == 0) throw new InvalidOperationException("A statup não possúi membro para ser removido.");
        Membros?.Remove(membro);
    }
    public void DesativarStartup()
    {
        Ativo = false;
    }
}
