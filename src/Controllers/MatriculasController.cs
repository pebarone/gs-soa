using Microsoft.AspNetCore.Mvc;
using GsSoa.DTOs;
using GsSoa.Services;

namespace GsSoa.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("2.0")]
public class MatriculasController : ControllerBase
{
    private readonly IMatriculaService _service;

    public MatriculasController(IMatriculaService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todas as matrículas
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MatriculaResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MatriculaResponseDto>>> GetAll()
    {
        var matriculas = await _service.GetAllAsync();
        return Ok(matriculas);
    }

    /// <summary>
    /// Busca uma matrícula por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(MatriculaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MatriculaResponseDto>> GetById(long id)
    {
        var matricula = await _service.GetByIdAsync(id);
        return Ok(matricula);
    }

    /// <summary>
    /// Lista matrículas de um usuário específico
    /// </summary>
    [HttpGet("usuario/{usuarioId}")]
    [ProducesResponseType(typeof(IEnumerable<MatriculaResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<MatriculaResponseDto>>> GetByUsuarioId(long usuarioId)
    {
        var matriculas = await _service.GetByUsuarioIdAsync(usuarioId);
        return Ok(matriculas);
    }

    /// <summary>
    /// Lista matrículas de uma trilha específica
    /// </summary>
    [HttpGet("trilha/{trilhaId}")]
    [ProducesResponseType(typeof(IEnumerable<MatriculaResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<MatriculaResponseDto>>> GetByTrilhaId(long trilhaId)
    {
        var matriculas = await _service.GetByTrilhaIdAsync(trilhaId);
        return Ok(matriculas);
    }

    /// <summary>
    /// Inscreve um usuário em uma trilha
    /// </summary>
    [HttpPost("inscrever")]
    [ProducesResponseType(typeof(MatriculaResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MatriculaResponseDto>> Inscrever([FromBody] MatriculaCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var matricula = await _service.InscreverAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = matricula.Id }, matricula);
    }

    /// <summary>
    /// Atualiza o progresso e/ou avaliação de uma matrícula
    /// </summary>
    [HttpPatch("{id}")]
    [ProducesResponseType(typeof(MatriculaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MatriculaResponseDto>> Update(long id, [FromBody] MatriculaUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var matricula = await _service.UpdateAsync(id, dto);
        return Ok(matricula);
    }

    /// <summary>
    /// Marca uma matrícula como concluída
    /// </summary>
    [HttpPost("{id}/concluir")]
    [ProducesResponseType(typeof(MatriculaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MatriculaResponseDto>> Concluir(long id, [FromBody] int? avaliacao = null)
    {
        var matricula = await _service.ConcluirAsync(id, avaliacao);
        return Ok(matricula);
    }

    /// <summary>
    /// Cancela uma matrícula
    /// </summary>
    [HttpPost("{id}/cancelar")]
    [ProducesResponseType(typeof(MatriculaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MatriculaResponseDto>> Cancelar(long id)
    {
        var matricula = await _service.CancelarAsync(id);
        return Ok(matricula);
    }

    /// <summary>
    /// Remove uma matrícula (admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(long id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
