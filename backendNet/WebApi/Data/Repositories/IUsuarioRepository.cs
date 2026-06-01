using Microsoft.EntityFrameworkCore;
using WebApi.Models;

namespace WebApi.Data.Repositories
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> ObtenerPorCorreoAsync(string correo);


        Task<IEnumerable<Usuario>> ObtenerTodosAsync();
        Task<Usuario?> ObtenerPorIdAsync(int id);
        Task InsertarAsync(Usuario usuario);
        Task ActualizarAsync(Usuario usuario);
        Task EliminarAsync(Usuario usuario);
    }

    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> ObtenerPorCorreoAsync(string correo)
        {
            // Busca en la tabla Usuarios el primero que coincida con el correo
            return await _context.usuario.FirstOrDefaultAsync(u => u.Email.ToLower() == correo.ToLower());
        }


        public async Task<IEnumerable<Usuario>> ObtenerTodosAsync()
        {
            return await _context.usuario.ToListAsync();
        }

        public async Task<Usuario?> ObtenerPorIdAsync(int id)
        {
            return await _context.usuario.FindAsync(id);
        }
        public async Task InsertarAsync(Usuario usuario)
        {
            await _context.usuario.AddAsync(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Usuario usuario)
        {
            _context.usuario.Update(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(Usuario usuario)
        {
            _context.usuario.Remove(usuario);
            await _context.SaveChangesAsync();
        }
    }
}
