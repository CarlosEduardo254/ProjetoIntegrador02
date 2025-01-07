namespace BackendDev.Models.Startup;

public record StartupRespostaDto(
        string Nome,
        string Descricao,
        StatusStartup StatusStartup,
        ModeloDeNegocio ModeloNegocio,
        bool Mvp,
        string Cnpj,
        Jornada Jornadas
    );