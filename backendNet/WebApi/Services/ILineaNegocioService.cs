using WebApi.Models;

namespace WebApi.Services
{
    public interface ILineaNegocioService
    {
        // Definimos un método asíncrono que recibe el parámetro 'buscar' opcional
        Task<IEnumerable<LineaNegocio>> ObtenerTodasAsync(string? buscar);
    }
}
