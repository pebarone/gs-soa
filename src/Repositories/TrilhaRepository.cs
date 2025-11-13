using Microsoft.EntityFrameworkCore;
using GsSoa.Data;
using GsSoa.Models;

namespace GsSoa.Repositories;

public class TrilhaRepository : ITrilhaRepository
{
    private readonly AppDbContext _context;

    public TrilhaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Trilha>> GetAllAsync()
    {
        return await _context.Trilhas
            .OrderBy(t => t.Nome)
            .ToListAsync();
    }

    public async Task<Trilha?> GetByIdAsync(long id)
    {
        return await _context.Trilhas
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Trilha> CreateAsync(Trilha trilha)
    {
        _context.Trilhas.Add(trilha);
        await _context.SaveChangesAsync();
        return trilha;
    }

    public async Task<Trilha> UpdateAsync(Trilha trilha)
    {
        _context.Trilhas.Update(trilha);
        await _context.SaveChangesAsync();
        return trilha;
    }

    public async Task DeleteAsync(long id)
    {
        var trilha = await GetByIdAsync(id);
        if (trilha != null)
        {
            _context.Trilhas.Remove(trilha);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(long id)
    {
        return await _context.Trilhas.AnyAsync(t => t.Id == id);
    }

    public async Task<int> CountAsync()
    {
        return await _context.Trilhas.CountAsync();
    }
}
