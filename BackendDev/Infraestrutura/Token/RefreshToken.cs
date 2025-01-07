namespace BackendDev.Infraestrutura.Token;

public class RefreshToken
{
    public string Token { get; set; } = Guid.NewGuid().ToString();
    public DateTime ExpiryTime { get; set; }
    public bool IsExpired => DateTime.UtcNow >= ExpiryTime;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}