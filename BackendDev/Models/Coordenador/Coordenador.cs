using System.ComponentModel.DataAnnotations.Schema;

namespace BackendDev.Models.Coordenador;

public class Coordenador
{
    public Guid Id { get; init; }
    public string Nome { get; private set; }
    public string Email { get; private set; }
    public string Contato { get; private set; }
    public string Senha { get; private set; }
    [ForeignKey("UsuarioId")]
    public Guid? UsuarioId { get; private set; }
    public bool Ativo { get; private set; }


    public Coordenador()
    {
    }

    public Coordenador(string nome, string email, string contato, string senha, Guid usuarioId)
    {
        Id = Guid.NewGuid(); // O EF pode sobrescrever este valor com o ID vindo do banco.
        Nome = nome ?? throw new ArgumentNullException(nameof(nome));
        Email = email ?? throw new ArgumentNullException(nameof(email));
        if (!contato.All(char.IsDigit))
            throw new ArgumentException("O contato deve conter apenas números");
        if (contato.Length < 8 || contato.Length > 15) throw new ArgumentException("O contato deve ter entre 8 e 15 dígitos");
        Contato = contato ?? throw new ArgumentNullException(nameof(contato));
        Senha = senha ?? throw new ArgumentNullException(nameof(senha));
        UsuarioId = usuarioId;
        Ativo = true;
    }

           
    public Coordenador(CoordenadorDto coordenadorDto)
    {
        Id = new Guid();
        Nome = coordenadorDto.Nome ?? throw new ArgumentNullException(nameof(coordenadorDto.Nome));
        Email = coordenadorDto.Email ?? throw new ArgumentNullException(nameof(coordenadorDto.Email));
        if (!coordenadorDto.Contato.All(char.IsDigit))
            throw new ArgumentException("O contato deve conter apenas números");
        if (coordenadorDto.Contato.Length < 8 || coordenadorDto.Contato.Length > 15)
            throw new ArgumentException("O contato deve ter entre 8 e 15 dígitos");
        Contato = coordenadorDto.Contato;
        Senha = coordenadorDto.Senha ?? throw new ArgumentNullException(nameof(coordenadorDto.Senha));
        Ativo = true;
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

    public void AdicionarUsuarioCoordenado(Guid usuarioId)
    {
        UsuarioId = usuarioId;
    }

    public void DesativarCoordenador()
    {
        Ativo = false;
    }
}