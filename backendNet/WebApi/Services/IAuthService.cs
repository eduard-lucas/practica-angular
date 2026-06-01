using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApi.Data.Repositories;

namespace WebApi.Services
{
    public interface IAuthService
    {
        // Devuelve el string del Token si es válido, o null si las credenciales fallan
        Task<string?> LoginAsync(string correo, string password);
    }

    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUsuarioRepository usuarioRepository, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _configuration = configuration;
        }

        public async Task<string?> LoginAsync(string correo, string password)
        {
            // 1. Buscar usuario por correo
            var usuario = await _usuarioRepository.ObtenerPorCorreoAsync(correo);
            if (usuario == null) return null;

            // 2. Validar contraseña (Modifica esto si en tu BD usas hash/bcrypt)
            //if (usuario.PasswordHash != password) return null;
            bool esValida = BCrypt.Net.BCrypt.Verify(password, usuario.PasswordHash);
            if (!esValida) return null; // Si no coincide, denegamos el acceso

            // 3. Si todo es correcto, generamos el Token JWT
            return GenerarJwtToken(usuario.Email);
        }

        private string GenerarJwtToken(string correo)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings.GetValue<string>("Key")!);

            // Almacenamos los datos del usuario dentro del Token (Claims)
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, correo),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2), // El token expira en 2 horas
                Issuer = jwtSettings.GetValue<string>("Issuer"),
                Audience = jwtSettings.GetValue<string>("Audience"),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
