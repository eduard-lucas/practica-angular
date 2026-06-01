using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTOs;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔒 Protegido con JWT
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var resultado = await _usuarioService.ObtenerTodosAsync();
            return Ok(new { success = true, data = resultado });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var resultado = await _usuarioService.ObtenerPorIdAsync(id);
            if (resultado == null) return NotFound(new { success = false, message = "Usuario no encontrado." });

            return Ok(new { success = true, data = resultado });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UsuarioCreateDto dto)
        {
            var creado = await _usuarioService.CrearAsync(dto);
            if (!creado) return BadRequest(new { success = false, message = "El correo ya está registrado." });

            return Ok(new { success = true, message = "Usuario creado exitosamente." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UsuarioUpdateDto dto)
        {
            var actualizado = await _usuarioService.ActualizarAsync(id, dto);
            if (!actualizado) return NotFound(new { success = false, message = "No se pudo actualizar el usuario." });

            return Ok(new { success = true, message = "Usuario actualizado exitosamente." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _usuarioService.EliminarAsync(id);
            if (!eliminado) return NotFound(new { success = false, message = "Usuario no encontrado." });

            return Ok(new { success = true, message = "Usuario eliminado de la base de datos." });
        }

    }
}
