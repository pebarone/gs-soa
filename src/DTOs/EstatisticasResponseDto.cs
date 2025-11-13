namespace GsSoa.DTOs;

public class EstatisticasResponseDto
{
    public int TotalUsuarios { get; set; }
    public int TotalTrilhas { get; set; }
    public int TotalMatriculas { get; set; }
    public int MatriculasAtivas { get; set; }
    public int MatriculasConcluidas { get; set; }
    public int MatriculasCanceladas { get; set; }
    public double TaxaConclusao { get; set; }
    public double AvaliacaoMedia { get; set; }
    public List<TrilhaMaisPopularDto> TrilhasMaisPopulares { get; set; } = new();
}

public class TrilhaMaisPopularDto
{
    public long TrilhaId { get; set; }
    public string TrilhaNome { get; set; } = string.Empty;
    public int TotalMatriculas { get; set; }
    public int Conclusoes { get; set; }
}
