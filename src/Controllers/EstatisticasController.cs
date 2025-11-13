using Microsoft.AspNetCore.Mvc;
using GsSoa.DTOs;
using GsSoa.Services;

namespace GsSoa.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("2.0")]
public class EstatisticasController : ControllerBase
{
    private readonly IMatriculaService _matriculaService;

    public EstatisticasController(IMatriculaService matriculaService)
    {
        _matriculaService = matriculaService;
    }

    /// <summary>
    /// Retorna estatísticas gerais da plataforma
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(EstatisticasResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<EstatisticasResponseDto>> GetEstatisticas()
    {
        var stats = await _matriculaService.GetEstatisticasAsync();
        return Ok(stats);
    }
}
