namespace BackendDev.Models.Startup;

public record StartupExibirDto(
    string Nome,
    string Descricao,
    List<Usuario.Usuario>? Membros,
    string Status,
    string ModeloNegocio,
    bool Mvp,
    string Cnpj,
    string Jornadas
);