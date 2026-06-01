using Microsoft.EntityFrameworkCore;
using WebApi.Models;

namespace WebApi.Data.Repositories
{
    public interface ILineaNegocioRepository
    {
        // El repositorio se encarga exclusivamente de la consulta física a la BD
        Task<IEnumerable<LineaNegocio>> ObtenerTodasAsync(string? buscar);
    }

    public class LineaNegocioRepository : ILineaNegocioRepository
    {
        private readonly AppDbContext _context;

        // El DbContext se inyecta SOLO en el repositorio (Capa de Datos)
        public LineaNegocioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LineaNegocio>> ObtenerTodasAsync(string? buscar)
        {
            var query = _context.lineaNegocio.AsQueryable();

            if (!string.IsNullOrWhiteSpace(buscar))
            {
                buscar = buscar.Trim().ToLower();
                query = query.Where(l => l.nombre.ToLower().Contains(buscar) ||
                                         (l.descripcion != null && l.descripcion.ToLower().Contains(buscar)));
            }

            return await query.ToListAsync();
        }
    }
}
