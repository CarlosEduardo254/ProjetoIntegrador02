namespace BackendDev.Models.Startup;

public record StartupUpdateDto(
    string? Status,
    string? ModeloNegocio,
    string? Jornadas,
    bool? Mvp,
    string? Descricao,
    string? Cnpj
);