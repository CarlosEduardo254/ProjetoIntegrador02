namespace BackendDev.Models.Startup;

public class Lucro
{
    public Guid Id { get; init; }
    public Guid StartupId { get; init; }
    public DateTime Data { get; private set; }
    public decimal Valor { get; private set; }

    public Lucro(Guid startupId, decimal valor)
    {
        Id = Guid.NewGuid();
        StartupId = startupId;
        Data = DateTime.Now;
        Valor = valor;
    }
}