namespace GsSoa.DTOs;

public class MatriculaResponseDto
{
    public long Id { get; set; }
    public long UsuarioId { get; set; }
    public string UsuarioNome { get; set; } = string.Empty;
    public string UsuarioEmail { get; set; } = string.Empty;
    public long TrilhaId { get; set; }
    public string TrilhaNome { get; set; } = string.Empty;
    public string TrilhaNivel { get; set; } = string.Empty;
    public int TrilhaCargaHoraria { get; set; }
    public DateTime DataInscricao { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? DataConclusao { get; set; }
    public int? ProgressoPercentual { get; set; }
    public DateTime? DataCancelamento { get; set; }
    public int? Avaliacao { get; set; }
}
