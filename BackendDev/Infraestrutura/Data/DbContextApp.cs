using BackendDev.Models.Coordenador;
using BackendDev.Models.Startup;
using BackendDev.Models.Usuario;
using Microsoft.EntityFrameworkCore;

namespace BackendDev.Infraestrutura.Data;

public class DbContextApp : DbContext
{
    public DbContextApp(DbContextOptions<DbContextApp> options) 
        : base(options)
    {
    }

    // DbSets
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Coordenador> Coordenadores { get; set; }
    public DbSet<Startup> Startups { get; set; }
    
    // DbSets para DashBoard
    public DbSet<Lucro> LucrosMensais { get; set; }
    public DbSet<AtualizacaoStartup> AtualizacoesStartup { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configurando a relação Coordenador -> Usuario
        modelBuilder.Entity<Coordenador>()
            .HasOne<Usuario>()
            .WithMany()
            .HasForeignKey(c => c.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configurando Startup -> Membros (muitos-para-muitos)
        modelBuilder.Entity<Startup>()
            .HasMany(s => s.Membros)
            .WithMany()
            .UsingEntity(j => j.ToTable("StartupMembros"));
        
        modelBuilder.Entity<Lucro>()
            .HasOne<Startup>()
            .WithMany(s => s.Lucros)
            .HasForeignKey(l => l.StartupId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AtualizacaoStartup>()
            .HasOne<Startup>()
            .WithMany(s => s.Atualizacoes)
            .HasForeignKey(a => a.StartupId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}