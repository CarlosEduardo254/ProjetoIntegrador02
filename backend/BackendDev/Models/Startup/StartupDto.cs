namespace BackendDev.Models.Startup;

public record StartupDto(
    string Nome,
    string Descricao,
    string Status,
    string ModeloNegocio,
    bool Mvp,
    string Cnpj,
    string Jornadas
    );