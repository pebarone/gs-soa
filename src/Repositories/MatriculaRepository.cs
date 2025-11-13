using Microsoft.EntityFrameworkCore;
using GsSoa.Data;
using GsSoa.Models;

namespace GsSoa.Repositories;

public class MatriculaRepository : IMatriculaRepository
{
    private readonly AppDbContext _context;

    public MatriculaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Matricula>> GetAllAsync()
    {
        return await _context.Matriculas
            .Include(m => m.Usuario)
            .Include(m => m.Trilha)
            .OrderByDescending(m => m.DataInscricao)
            .ToListAsync();
    }

    public async Task<Matricula?> GetByIdAsync(long id)
    {
        return await _context.Matriculas
            .Include(m => m.Usuario)
            .Include(m => m.Trilha)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<IEnumerable<Matricula>> GetByUsuarioIdAsync(long usuarioId)
    {
        return await _context.Matriculas
            .Include(m => m.Usuario)
            .Include(m => m.Trilha)
            .Where(m => m.UsuarioId == usuarioId)
            .OrderByDescending(m => m.DataInscricao)
            .ToListAsync();
    }

    public async Task<IEnumerable<Matricula>> GetByTrilhaIdAsync(long trilhaId)
    {
        return await _context.Matriculas
            .Include(m => m.Usuario)
            .Include(m => m.Trilha)
            .Where(m => m.TrilhaId == trilhaId)
            .OrderByDescending(m => m.DataInscricao)
            .ToListAsync();
    }

    public async Task<Matricula?> GetByUsuarioAndTrilhaAsync(long usuarioId, long trilhaId)
    {
        return await _context.Matriculas
            .Include(m => m.Usuario)
            .Include(m => m.Trilha)
            .FirstOrDefaultAsync(m => m.UsuarioId == usuarioId && m.TrilhaId == trilhaId);
    }

    public async Task<Matricula> CreateAsync(Matricula matricula)
    {
        _context.Matriculas.Add(matricula);
        await _context.SaveChangesAsync();
        
        // Reload with navigation properties
        return (await GetByIdAsync(matricula.Id))!;
    }

    public async Task<Matricula> UpdateAsync(Matricula matricula)
    {
        _context.Matriculas.Update(matricula);
        await _context.SaveChangesAsync();
        
        // Reload with navigation properties
        return (await GetByIdAsync(matricula.Id))!;
    }

    public async Task DeleteAsync(long id)
    {
        var matricula = await _context.Matriculas.FindAsync(id);
        if (matricula != null)
        {
            _context.Matriculas.Remove(matricula);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(long id)
    {
        return await _context.Matriculas.AnyAsync(m => m.Id == id);
    }

    public async Task<bool> UsuarioJaInscritoAsync(long usuarioId, long trilhaId)
    {
        return await _context.Matriculas
            .AnyAsync(m => m.UsuarioId == usuarioId && 
                          m.TrilhaId == trilhaId && 
                          m.Status != "CANCELADA");
    }

    public async Task<int> CountTotalAsync()
    {
        return await _context.Matriculas.CountAsync();
    }

    public async Task<int> CountByStatusAsync(string status)
    {
        return await _context.Matriculas.CountAsync(m => m.Status == status);
    }

    public async Task<double> GetAvaliacaoMediaAsync()
    {
        var avaliacoes = await _context.Matriculas
            .Where(m => m.Avaliacao.HasValue)
            .Select(m => m.Avaliacao!.Value)
            .ToListAsync();
        
        return avaliacoes.Any() ? avaliacoes.Average() : 0;
    }

    public async Task<IEnumerable<(long TrilhaId, string TrilhaNome, int Total, int Conclusoes)>> 
        GetTrilhasMaisPopularesAsync(int limit = 5)
    {
        return await _context.Matriculas
            .Include(m => m.Trilha)
            .GroupBy(m => new { m.TrilhaId, m.Trilha.Nome })
            .Select(g => new
            {
                TrilhaId = g.Key.TrilhaId,
                TrilhaNome = g.Key.Nome,
                Total = g.Count(),
                Conclusoes = g.Count(m => m.Status == "CONCLUIDA")
            })
            .OrderByDescending(x => x.Total)
            .Take(limit)
            .Select(x => ValueTuple.Create(x.TrilhaId, x.TrilhaNome, x.Total, x.Conclusoes))
            .ToListAsync();
    }
}
