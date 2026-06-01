using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // La ruta del endpoint será: api/lineas
    [Authorize]
    public class LineaNegocioController : ControllerBase
    {
        private readonly ILineaNegocioService _lineaService;

        // Inyectamos ÚNICAMENTE la capa de negocio (Services)
        public LineaNegocioController(ILineaNegocioService lineaService)
        {
            _lineaService = lineaService;
        }

        // Endpoint GET: api/lineas o api/lineas?buscar=texto
        [HttpGet("getAllLinea")]
        public async Task<IActionResult> ObtenerTodas([FromQuery] string? buscar)
        {
            try
            {
                // Le pedimos los datos al servicio (el cual se los pidió al repositorio)
                var resultado = await _lineaService.ObtenerTodasAsync(buscar);

                // Retornamos el formato exacto { success: true, data: [...] } que espera tu Angular
                return Ok(new { success = true, data = resultado });
            }
            catch (Exception ex)
            {
                // Si algo falla (ej. base de datos caída), respondemos de forma segura
                return StatusCode(500, new { success = false, message = "Error al obtener las líneas de negocio.", error = ex.Message });
            }
        }
    }
}
