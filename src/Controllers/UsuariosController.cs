using Microsoft.AspNetCore.Mvc;
using GsSoa.DTOs;
using GsSoa.Services;

namespace GsSoa.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _service;

    public UsuariosController(IUsuarioService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todos os usuários cadastrados
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsuarioResponseDto>>> GetAll()
    {
        var usuarios = await _service.GetAllAsync();
        return Ok(usuarios);
    }

    /// <summary>
    /// Busca um usuário por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<UsuarioResponseDto>> GetById(long id)
    {
        var usuario = await _service.GetByIdAsync(id);
        return Ok(usuario);
    }

    /// <summary>
    /// Cria um novo usuário
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<UsuarioResponseDto>> Create([FromBody] UsuarioCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var usuario = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
    }

    /// <summary>
    /// Atualiza um usuário existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<UsuarioResponseDto>> Update(long id, [FromBody] UsuarioUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var usuario = await _service.UpdateAsync(id, dto);
        return Ok(usuario);
    }

    /// <summary>
    /// Remove um usuário
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
