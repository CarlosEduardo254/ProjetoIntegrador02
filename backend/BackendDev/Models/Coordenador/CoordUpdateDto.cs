namespace BackendDev.Models.Coordenador;

public record CoordUpdateDto(
    string? Email = null, 
    string? Senha = null, 
    string? Contato = null
    );