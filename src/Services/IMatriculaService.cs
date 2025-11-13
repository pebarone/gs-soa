using GsSoa.DTOs;

namespace GsSoa.Services;

public interface IMatriculaService
{
    Task<IEnumerable<MatriculaResponseDto>> GetAllAsync();
    Task<MatriculaResponseDto> GetByIdAsync(long id);
    Task<IEnumerable<MatriculaResponseDto>> GetByUsuarioIdAsync(long usuarioId);
    Task<IEnumerable<MatriculaResponseDto>> GetByTrilhaIdAsync(long trilhaId);
    Task<MatriculaResponseDto> InscreverAsync(MatriculaCreateDto dto);
    Task<MatriculaResponseDto> UpdateAsync(long id, MatriculaUpdateDto dto);
    Task<MatriculaResponseDto> ConcluirAsync(long id, int? avaliacao);
    Task<MatriculaResponseDto> CancelarAsync(long id);
    Task DeleteAsync(long id);
    Task<EstatisticasResponseDto> GetEstatisticasAsync();
}
