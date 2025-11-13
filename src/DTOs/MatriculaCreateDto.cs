using System.ComponentModel.DataAnnotations;

namespace GsSoa.DTOs;

public class MatriculaCreateDto
{
    [Required(ErrorMessage = "O ID do usuário é obrigatório")]
    public long UsuarioId { get; set; }

    [Required(ErrorMessage = "O ID da trilha é obrigatório")]
    public long TrilhaId { get; set; }
}
