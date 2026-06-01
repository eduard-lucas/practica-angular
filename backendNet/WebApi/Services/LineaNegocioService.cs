using WebApi.Data.Repositories;
using WebApi.Models;

namespace WebApi.Services
{
    public class LineaNegocioService : ILineaNegocioService
    {
        private readonly ILineaNegocioRepository _lineaNegocioRep;
        public LineaNegocioService(ILineaNegocioRepository lineaNegocioRep)
        {
            _lineaNegocioRep = lineaNegocioRep;
        }

        public async Task<IEnumerable<LineaNegocio>> ObtenerTodasAsync(string? buscar)
        {
            return await _lineaNegocioRep.ObtenerTodasAsync(buscar);
        }
    }
}
