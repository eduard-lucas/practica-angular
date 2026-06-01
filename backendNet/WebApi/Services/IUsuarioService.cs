using WebApi.Data.Repositories;
using WebApi.DTOs;
using WebApi.Models;

namespace WebApi.Services
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioResponseDto>> ObtenerTodosAsync();
        Task<UsuarioResponseDto?> ObtenerPorIdAsync(int id);
        Task<bool> CrearAsync(UsuarioCreateDto dto);
        Task<bool> ActualizarAsync(int id, UsuarioUpdateDto dto);
        Task<bool> EliminarAsync(int id);
    }

    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<IEnumerable<UsuarioResponseDto>> ObtenerTodosAsync()
        {
            var usuarios = await _usuarioRepository.ObtenerTodosAsync();
            return usuarios.Select(u => new UsuarioResponseDto
            {
                Id = u.Id,
                Email = u.Email
            });
        }

        public async Task<UsuarioResponseDto?> ObtenerPorIdAsync(int id)
        {
            var usuario = await _usuarioRepository.ObtenerPorIdAsync(id);
            if (usuario == null) return null;

            return new UsuarioResponseDto { Id = usuario.Id, Email = usuario.Email };
        }

        public async Task<bool> CrearAsync(UsuarioCreateDto dto)
        {
            // Validar que el correo no esté repetido
            var existe = await _usuarioRepository.ObtenerPorCorreoAsync(dto.Email);
            if (existe != null) return false; // Ya existe

            // Creamos la entidad mapeada y ENCRIPTAMOS con BCrypt
            var nuevoUsuario = new Usuario
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password) // 👈 AQUÍ SE ENCRIPTA AL CREAR
            };

            await _usuarioRepository.InsertarAsync(nuevoUsuario);
            return true;
        }

        public async Task<bool> ActualizarAsync(int id, UsuarioUpdateDto dto)
        {
            var usuario = await _usuarioRepository.ObtenerPorIdAsync(id);
            if (usuario == null) return false;

            usuario.Email = dto.Email;

            // Si el usuario envió una nueva contraseña, la encriptamos. Si no, se queda el hash actual.
            if (!string.IsNullOrEmpty(dto.Password))
            {
                usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password); // 👈 AQUÍ SE ENCRIPTA AL EDITAR
            }

            await _usuarioRepository.ActualizarAsync(usuario);
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var usuario = await _usuarioRepository.ObtenerPorIdAsync(id);
            if (usuario == null) return false;

            await _usuarioRepository.EliminarAsync(usuario);
            return true;
        }
    }

}
