namespace BackendDev.Models.Usuario;

public class UsuarioLider : Usuario
{
    public UsuarioLider(string nome, string email, string contato, Tipo_membro tipoMembro, string senha) 
        : base(nome, email, contato, tipoMembro, senha)
    {
    }

    public UsuarioLider(UsuarioDTO usuarioDto) : base(usuarioDto)
    {
    }

    public void RealocarMembro()
    {
        // Implement member reallocation logic
    }

    public void MarcarReuniao()
    {
        // Implement meeting scheduling logic
    }
}