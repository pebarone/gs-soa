using System.ComponentModel.DataAnnotations;

namespace GsSoa.DTOs;

public class MatriculaUpdateDto
{
    [Range(0, 100, ErrorMessage = "O progresso deve estar entre 0 e 100")]
    public int? ProgressoPercentual { get; set; }

    [Range(1, 5, ErrorMessage = "A avaliação deve estar entre 1 e 5")]
    public int? Avaliacao { get; set; }
}
