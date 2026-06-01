namespace WebApi.DTOs
{
    public class UsuarioDtos
    {
    }
    // Lo que devuelve la API (Seguro, sin hashes)
    public class UsuarioResponseDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
    }

    // Lo que recibe la API al crear
    public class UsuarioCreateDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // Clave en texto plano de Angular
    }

    // Lo que recibe la API al editar (Password opcional)
    public class UsuarioUpdateDto
    {
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; } // Si viene nulo, no se cambia la clave
    }
}
