using GsSoa.DTOs;
using GsSoa.Models;

namespace GsSoa.Repositories;

public interface IMatriculaRepository
{
    Task<IEnumerable<Matricula>> GetAllAsync();
    Task<Matricula?> GetByIdAsync(long id);
    Task<IEnumerable<Matricula>> GetByUsuarioIdAsync(long usuarioId);
    Task<IEnumerable<Matricula>> GetByTrilhaIdAsync(long trilhaId);
    Task<Matricula?> GetByUsuarioAndTrilhaAsync(long usuarioId, long trilhaId);
    Task<Matricula> CreateAsync(Matricula matricula);
    Task<Matricula> UpdateAsync(Matricula matricula);
    Task DeleteAsync(long id);
    Task<bool> ExistsAsync(long id);
    Task<bool> UsuarioJaInscritoAsync(long usuarioId, long trilhaId);
    Task<int> CountTotalAsync();
    Task<int> CountByStatusAsync(string status);
    Task<double> GetAvaliacaoMediaAsync();
    Task<IEnumerable<(long TrilhaId, string TrilhaNome, int Total, int Conclusoes)>> GetTrilhasMaisPopularesAsync(int limit = 5);
}
