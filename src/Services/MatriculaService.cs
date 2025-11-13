using GsSoa.DTOs;
using GsSoa.Models;
using GsSoa.Repositories;
using GsSoa.Exceptions;

namespace GsSoa.Services;

public class MatriculaService : IMatriculaService
{
    private readonly IMatriculaRepository _matriculaRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ITrilhaRepository _trilhaRepository;

    public MatriculaService(
        IMatriculaRepository matriculaRepository,
        IUsuarioRepository usuarioRepository,
        ITrilhaRepository trilhaRepository)
    {
        _matriculaRepository = matriculaRepository;
        _usuarioRepository = usuarioRepository;
        _trilhaRepository = trilhaRepository;
    }

    public async Task<IEnumerable<MatriculaResponseDto>> GetAllAsync()
    {
        var matriculas = await _matriculaRepository.GetAllAsync();
        return matriculas.Select(MapToDto);
    }

    public async Task<MatriculaResponseDto> GetByIdAsync(long id)
    {
        var matricula = await _matriculaRepository.GetByIdAsync(id);
        if (matricula == null)
        {
            throw new ResourceNotFoundException($"Matrícula com ID {id} não encontrada");
        }
        return MapToDto(matricula);
    }

    public async Task<IEnumerable<MatriculaResponseDto>> GetByUsuarioIdAsync(long usuarioId)
    {
        // Verifica se usuário existe
        if (!await _usuarioRepository.ExistsAsync(usuarioId))
        {
            throw new ResourceNotFoundException($"Usuário com ID {usuarioId} não encontrado");
        }

        var matriculas = await _matriculaRepository.GetByUsuarioIdAsync(usuarioId);
        return matriculas.Select(MapToDto);
    }

    public async Task<IEnumerable<MatriculaResponseDto>> GetByTrilhaIdAsync(long trilhaId)
    {
        // Verifica se trilha existe
        if (!await _trilhaRepository.ExistsAsync(trilhaId))
        {
            throw new ResourceNotFoundException($"Trilha com ID {trilhaId} não encontrada");
        }

        var matriculas = await _matriculaRepository.GetByTrilhaIdAsync(trilhaId);
        return matriculas.Select(MapToDto);
    }

    public async Task<MatriculaResponseDto> InscreverAsync(MatriculaCreateDto dto)
    {
        // Validações
        if (!await _usuarioRepository.ExistsAsync(dto.UsuarioId))
        {
            throw new ResourceNotFoundException($"Usuário com ID {dto.UsuarioId} não encontrado");
        }

        if (!await _trilhaRepository.ExistsAsync(dto.TrilhaId))
        {
            throw new ResourceNotFoundException($"Trilha com ID {dto.TrilhaId} não encontrada");
        }

        // Verifica se usuário já está inscrito
        if (await _matriculaRepository.UsuarioJaInscritoAsync(dto.UsuarioId, dto.TrilhaId))
        {
            throw new BusinessException("Usuário já está inscrito nesta trilha");
        }

        var matricula = new Matricula
        {
            UsuarioId = dto.UsuarioId,
            TrilhaId = dto.TrilhaId,
            DataInscricao = DateTime.Now,
            Status = "ATIVA",
            ProgressoPercentual = 0
        };

        var created = await _matriculaRepository.CreateAsync(matricula);
        return MapToDto(created);
    }

    public async Task<MatriculaResponseDto> UpdateAsync(long id, MatriculaUpdateDto dto)
    {
        var matricula = await _matriculaRepository.GetByIdAsync(id);
        if (matricula == null)
        {
            throw new ResourceNotFoundException($"Matrícula com ID {id} não encontrada");
        }

        if (matricula.Status == "CONCLUIDA")
        {
            throw new BusinessException("Não é possível atualizar uma matrícula já concluída");
        }

        if (matricula.Status == "CANCELADA")
        {
            throw new BusinessException("Não é possível atualizar uma matrícula cancelada");
        }

        // Atualiza progresso se fornecido
        if (dto.ProgressoPercentual.HasValue)
        {
            matricula.ProgressoPercentual = dto.ProgressoPercentual.Value;
            
            // Se atingiu 100%, considera concluída automaticamente
            if (dto.ProgressoPercentual.Value >= 100)
            {
                matricula.Status = "CONCLUIDA";
                matricula.DataConclusao = DateTime.Now;
                matricula.ProgressoPercentual = 100;
            }
        }

        // Atualiza avaliação se fornecida
        if (dto.Avaliacao.HasValue)
        {
            matricula.Avaliacao = dto.Avaliacao.Value;
        }

        var updated = await _matriculaRepository.UpdateAsync(matricula);
        return MapToDto(updated);
    }

    public async Task<MatriculaResponseDto> ConcluirAsync(long id, int? avaliacao)
    {
        var matricula = await _matriculaRepository.GetByIdAsync(id);
        if (matricula == null)
        {
            throw new ResourceNotFoundException($"Matrícula com ID {id} não encontrada");
        }

        if (matricula.Status == "CONCLUIDA")
        {
            throw new BusinessException("Matrícula já está concluída");
        }

        if (matricula.Status == "CANCELADA")
        {
            throw new BusinessException("Não é possível concluir uma matrícula cancelada");
        }

        matricula.Status = "CONCLUIDA";
        matricula.DataConclusao = DateTime.Now;
        matricula.ProgressoPercentual = 100;

        if (avaliacao.HasValue)
        {
            if (avaliacao.Value < 1 || avaliacao.Value > 5)
            {
                throw new BusinessException("Avaliação deve estar entre 1 e 5");
            }
            matricula.Avaliacao = avaliacao.Value;
        }

        var updated = await _matriculaRepository.UpdateAsync(matricula);
        return MapToDto(updated);
    }

    public async Task<MatriculaResponseDto> CancelarAsync(long id)
    {
        var matricula = await _matriculaRepository.GetByIdAsync(id);
        if (matricula == null)
        {
            throw new ResourceNotFoundException($"Matrícula com ID {id} não encontrada");
        }

        if (matricula.Status == "CONCLUIDA")
        {
            throw new BusinessException("Não é possível cancelar uma matrícula já concluída");
        }

        if (matricula.Status == "CANCELADA")
        {
            throw new BusinessException("Matrícula já está cancelada");
        }

        matricula.Status = "CANCELADA";
        matricula.DataCancelamento = DateTime.Now;

        var updated = await _matriculaRepository.UpdateAsync(matricula);
        return MapToDto(updated);
    }

    public async Task DeleteAsync(long id)
    {
        if (!await _matriculaRepository.ExistsAsync(id))
        {
            throw new ResourceNotFoundException($"Matrícula com ID {id} não encontrada");
        }

        await _matriculaRepository.DeleteAsync(id);
    }

    public async Task<EstatisticasResponseDto> GetEstatisticasAsync()
    {
        var totalUsuarios = await _usuarioRepository.CountAsync();
        var totalTrilhas = await _trilhaRepository.CountAsync();
        var totalMatriculas = await _matriculaRepository.CountTotalAsync();
        var matriculasAtivas = await _matriculaRepository.CountByStatusAsync("ATIVA");
        var matriculasConcluidas = await _matriculaRepository.CountByStatusAsync("CONCLUIDA");
        var matriculasCanceladas = await _matriculaRepository.CountByStatusAsync("CANCELADA");
        var avaliacaoMedia = await _matriculaRepository.GetAvaliacaoMediaAsync();
        var trilhasPopulares = await _matriculaRepository.GetTrilhasMaisPopularesAsync();

        var taxaConclusao = totalMatriculas > 0 
            ? (double)matriculasConcluidas / totalMatriculas * 100 
            : 0;

        return new EstatisticasResponseDto
        {
            TotalUsuarios = totalUsuarios,
            TotalTrilhas = totalTrilhas,
            TotalMatriculas = totalMatriculas,
            MatriculasAtivas = matriculasAtivas,
            MatriculasConcluidas = matriculasConcluidas,
            MatriculasCanceladas = matriculasCanceladas,
            TaxaConclusao = Math.Round(taxaConclusao, 2),
            AvaliacaoMedia = Math.Round(avaliacaoMedia, 2),
            TrilhasMaisPopulares = trilhasPopulares.Select(t => new TrilhaMaisPopularDto
            {
                TrilhaId = t.TrilhaId,
                TrilhaNome = t.TrilhaNome,
                TotalMatriculas = t.Total,
                Conclusoes = t.Conclusoes
            }).ToList()
        };
    }

    private static MatriculaResponseDto MapToDto(Matricula matricula)
    {
        return new MatriculaResponseDto
        {
            Id = matricula.Id,
            UsuarioId = matricula.UsuarioId,
            UsuarioNome = matricula.Usuario?.Nome ?? string.Empty,
            UsuarioEmail = matricula.Usuario?.Email ?? string.Empty,
            TrilhaId = matricula.TrilhaId,
            TrilhaNome = matricula.Trilha?.Nome ?? string.Empty,
            TrilhaNivel = matricula.Trilha?.Nivel ?? string.Empty,
            TrilhaCargaHoraria = matricula.Trilha?.CargaHoraria ?? 0,
            DataInscricao = matricula.DataInscricao,
            Status = matricula.Status,
            DataConclusao = matricula.DataConclusao,
            ProgressoPercentual = matricula.ProgressoPercentual,
            DataCancelamento = matricula.DataCancelamento,
            Avaliacao = matricula.Avaliacao
        };
    }
}
