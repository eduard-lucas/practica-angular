using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models
{
    [Table("LineasNegocio")]
    public class LineaNegocio
    {
        [Key]
        public int id { get; set; }

        [Required]
        //[Column("Nombre_Linea")] // <-- Mapea la columna por si en SQL se llama diferente
        public string nombre { get; set; }
        public string? descripcion { get; set; }
    }
}
