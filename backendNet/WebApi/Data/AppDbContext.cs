using Microsoft.EntityFrameworkCore;
using WebApi.Models;

namespace WebApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> op) : base(op) { }

        public DbSet<LineaNegocio> lineaNegocio { get; set; } = null!;
        public DbSet<Usuario> usuario { get; set; } = null!;


    }
}
