using Microsoft.EntityFrameworkCore;
using GsSoa.Data;
using GsSoa.Repositories;
using GsSoa.Services;
using GsSoa.Middleware;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configurar API Versioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

// Configuração do DbContext com Oracle
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseOracle(connectionString));

// Injeção de Dependência - Repositories
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ITrilhaRepository, TrilhaRepository>();
builder.Services.AddScoped<IMatriculaRepository, MatriculaRepository>();

// Injeção de Dependência - Services
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<ITrilhaService, TrilhaService>();
builder.Services.AddScoped<IMatriculaService, MatriculaService>();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() 
    { 
        Title = "API Plataforma de Upskilling/Reskilling", 
        Version = "v1",
        Description = "API RESTful v1 para plataforma de capacitação profissional voltada ao futuro do trabalho 2030+",
        Contact = new() 
        { 
            Name = "Global Solution 2025",
            Email = "contato@futurotrabalho.com"
        }
    });
    
    c.SwaggerDoc("v2", new() 
    { 
        Title = "API Plataforma de Upskilling/Reskilling", 
        Version = "v2",
        Description = "API RESTful v2 com funcionalidades avançadas de matrículas, conclusões e estatísticas",
        Contact = new() 
        { 
            Name = "Global Solution 2025",
            Email = "contato@futurotrabalho.com"
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Plataforma v1");
        c.SwaggerEndpoint("/swagger/v2/swagger.json", "API Plataforma v2");
        c.RoutePrefix = "api-docs"; // Swagger em /api-docs
    });
}

// Middleware de tratamento de exceções
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

// Serve static files from the static folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "static")),
    RequestPath = "/static"
});

app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = new List<string> { "index.html" },
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "static"))
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "static"))
});

app.UseAuthorization();

app.MapControllers();

// Fallback to SPA index.html without relying on WebRoot
app.MapFallback(() =>
{
    var indexPath = Path.Combine(builder.Environment.ContentRootPath, "static", "index.html");
    return File.Exists(indexPath)
        ? Results.File(indexPath, "text/html")
        : Results.NotFound();
});

app.Run();
