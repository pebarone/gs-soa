using Microsoft.EntityFrameworkCore;
using GsSoa.Models;

namespace GsSoa.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Trilha> Trilhas { get; set; }
    public DbSet<Competencia> Competencias { get; set; }
    public DbSet<TrilhaCompetencia> TrilhaCompetencias { get; set; }
    public DbSet<Matricula> Matriculas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Mapeamento para tabelas Oracle com prefixo TRILHAS_
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("TRILHAS_USUARIOS");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Nome).HasColumnName("NOME");
            entity.Property(e => e.Email).HasColumnName("EMAIL");
            entity.Property(e => e.AreaAtuacao).HasColumnName("AREA_ATUACAO");
            entity.Property(e => e.NivelCarreira).HasColumnName("NIVEL_CARREIRA");
            entity.Property(e => e.DataCadastro).HasColumnName("DATA_CADASTRO");
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Trilha>(entity =>
        {
            entity.ToTable("TRILHAS_TRILHAS");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Nome).HasColumnName("NOME");
            entity.Property(e => e.Descricao).HasColumnName("DESCRICAO");
            entity.Property(e => e.Nivel).HasColumnName("NIVEL");
            entity.Property(e => e.CargaHoraria).HasColumnName("CARGA_HORARIA");
            entity.Property(e => e.FocoPrincipal).HasColumnName("FOCO_PRINCIPAL");
        });

        modelBuilder.Entity<Competencia>(entity =>
        {
            entity.ToTable("TRILHAS_COMPETENCIAS");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Nome).HasColumnName("NOME");
            entity.Property(e => e.Categoria).HasColumnName("CATEGORIA");
            entity.Property(e => e.Descricao).HasColumnName("DESCRICAO");
        });

        modelBuilder.Entity<Matricula>(entity =>
        {
            entity.ToTable("TRILHAS_MATRICULAS");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.UsuarioId).HasColumnName("USUARIO_ID");
            entity.Property(e => e.TrilhaId).HasColumnName("TRILHA_ID");
            entity.Property(e => e.DataInscricao).HasColumnName("DATA_INSCRICAO");
            entity.Property(e => e.Status).HasColumnName("STATUS");
            entity.Property(e => e.DataConclusao).HasColumnName("DATA_CONCLUSAO");
            entity.Property(e => e.ProgressoPercentual).HasColumnName("PROGRESSO_PERCENTUAL");
            entity.Property(e => e.DataCancelamento).HasColumnName("DATA_CANCELAMENTO");
            entity.Property(e => e.Avaliacao).HasColumnName("AVALIACAO");
        });

        modelBuilder.Entity<TrilhaCompetencia>(entity =>
        {
            entity.ToTable("TRILHAS_TRILHA_COMPETENCIA");
            entity.HasKey(tc => new { tc.TrilhaId, tc.CompetenciaId });
            entity.Property(e => e.TrilhaId).HasColumnName("TRILHA_ID");
            entity.Property(e => e.CompetenciaId).HasColumnName("COMPETENCIA_ID");
        });

        // Configuração da chave composta para TrilhaCompetencia
        modelBuilder.Entity<TrilhaCompetencia>()
            .HasKey(tc => new { tc.TrilhaId, tc.CompetenciaId });

        // Relacionamento Trilha -> TrilhaCompetencia
        modelBuilder.Entity<TrilhaCompetencia>()
            .HasOne(tc => tc.Trilha)
            .WithMany(t => t.TrilhaCompetencias)
            .HasForeignKey(tc => tc.TrilhaId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relacionamento Competencia -> TrilhaCompetencia
        modelBuilder.Entity<TrilhaCompetencia>()
            .HasOne(tc => tc.Competencia)
            .WithMany(c => c.TrilhaCompetencias)
            .HasForeignKey(tc => tc.CompetenciaId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relacionamento Usuario -> Matricula
        modelBuilder.Entity<Matricula>()
            .HasOne(m => m.Usuario)
            .WithMany(u => u.Matriculas)
            .HasForeignKey(m => m.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relacionamento Trilha -> Matricula
        modelBuilder.Entity<Matricula>()
            .HasOne(m => m.Trilha)
            .WithMany(t => t.Matriculas)
            .HasForeignKey(m => m.TrilhaId)
            .OnDelete(DeleteBehavior.Cascade);

        // Índice único para email de usuário
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}
