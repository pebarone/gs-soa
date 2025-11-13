using GsSoa.Models;

namespace GsSoa.Repositories;

public interface ITrilhaRepository
{
    Task<IEnumerable<Trilha>> GetAllAsync();
    Task<Trilha?> GetByIdAsync(long id);
    Task<Trilha> CreateAsync(Trilha trilha);
    Task<Trilha> UpdateAsync(Trilha trilha);
    Task DeleteAsync(long id);
    Task<bool> ExistsAsync(long id);
    Task<int> CountAsync();
}
