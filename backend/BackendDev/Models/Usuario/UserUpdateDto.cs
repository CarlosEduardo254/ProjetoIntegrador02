namespace BackendDev.Models.Usuario;

public record UserUpdateDto(
        string? email = null,
        string? senha = null,
        string? contato = null,
        string? tipo_membro = null
    );
