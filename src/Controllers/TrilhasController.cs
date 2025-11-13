using Microsoft.AspNetCore.Mvc;
using GsSoa.DTOs;
using GsSoa.Services;

namespace GsSoa.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class TrilhasController : ControllerBase
{
    private readonly ITrilhaService _service;

    public TrilhasController(ITrilhaService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todas as trilhas de aprendizagem
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TrilhaResponseDto>>> GetAll()
    {
        var trilhas = await _service.GetAllAsync();
        return Ok(trilhas);
    }

    /// <summary>
    /// Busca uma trilha por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TrilhaResponseDto>> GetById(long id)
    {
        var trilha = await _service.GetByIdAsync(id);
        return Ok(trilha);
    }

    /// <summary>
    /// Cria uma nova trilha de aprendizagem
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TrilhaResponseDto>> Create([FromBody] TrilhaCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var trilha = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = trilha.Id }, trilha);
    }

    /// <summary>
    /// Atualiza uma trilha existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TrilhaResponseDto>> Update(long id, [FromBody] TrilhaUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var trilha = await _service.UpdateAsync(id, dto);
        return Ok(trilha);
    }

    /// <summary>
    /// Remove uma trilha
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
