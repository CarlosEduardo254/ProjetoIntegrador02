using BackendDev.Infraestrutura.Token;

namespace BackendDev.Models.Usuario;

public class Usuario
{
    public Guid Id { get; init; }
    public string Nome { get; private set; }
    public string Email { get; private set; }
    public string Contato { get; private set; }
    public Tipo_membro TipoMembro { get; private set; }
    public string Senha { get; private set; }
    public bool EstaAtivo { get; private set; }

    public string? RefreshToken { get; private set; }
    public DateTime RefreshTokenExpiryTime { get; private set; }

    public void SetRefreshToken(RefreshToken refreshToken)
    {
        RefreshToken = refreshToken.Token;
        RefreshTokenExpiryTime = refreshToken.ExpiryTime;
    }

    public Usuario(string nome, string email, string contato, Tipo_membro tipoMembro, string senha)
    {
        Id = Guid.NewGuid();
        Nome = nome ?? throw new ArgumentNullException(nameof(nome));
        Email = email ?? throw new ArgumentNullException(nameof(email));
        if (!contato.All(char.IsDigit))
            throw new ArgumentException("O contato deve conter apenas números");
        if (contato.Length < 8 || contato.Length > 15)
            throw new ArgumentException("O contato deve ter entre 8 e 15 dígitos");
        Contato = contato;
        TipoMembro = tipoMembro;
        Senha = senha ?? throw new ArgumentNullException(nameof(senha));
        EstaAtivo = true;
    }

    public Usuario(UsuarioDTO usuarioDto)
    {
        Id = Guid.NewGuid();
        Nome = usuarioDto.nome;
        Email = usuarioDto.email;
        if (!usuarioDto.contato.All(char.IsDigit))
            throw new ArgumentException("O contato deve conter apenas números");
        if (usuarioDto.contato.Length < 8 || usuarioDto.contato.Length > 15)
            throw new ArgumentException("O contato deve ter entre 8 e 15 dígitos");
        Contato = usuarioDto.contato;
        try
        {
            TipoMembro = Enum.Parse<Tipo_membro>(usuarioDto.Tipo_membro, true);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Erro ao converter Tipo_membro: {ex.Message}");
            throw new ArgumentException("Valor inválido para Tipo_membro.", ex); // Lança uma exceção mais informativa
        }
        Senha = usuarioDto.senha;
        EstaAtivo = true;
    }

    public void AtualizarTipoMembro(string? tipoMembro)
    {
        try
        {
            TipoMembro = Enum.Parse<Tipo_membro>(tipoMembro, true);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Erro ao converter Tipo_membro: {ex.Message}");
            throw new ArgumentException("Valor inválido para Tipo_membro.", ex); // Lança uma exceção mais informativa
        }
    }


    public void AtualizarNome(string nome)
    {
        Nome = nome ?? throw new ArgumentNullException(nameof(nome));
    }
    
    public void AtualizarEmail(string email)
    {
        Email = email ?? throw new ArgumentNullException(nameof(email));
    }
    
    public void AtualizarSenha(string senha)
    {
        Senha = senha ?? throw new ArgumentNullException(nameof(senha));
    }

    public void AtualizarContato(string contato)
    {
        if (!contato.All(char.IsDigit))
            throw new ArgumentException("O contato deve conter apenas números");
        if (contato.Length < 8 || contato.Length > 15)
            throw new ArgumentException("O contato deve ter entre 8 e 15 dígitos");
        Contato = contato;
    }

    public void DesativarConta()
    {
        EstaAtivo = false;
    }

}