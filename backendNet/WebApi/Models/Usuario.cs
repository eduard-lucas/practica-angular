using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models
{
    [Table("Usuarios")]
    public class Usuario
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Column("email")]
        public string Email { get; set; } = string.Empty;
        [Required]
        [Column("password")]
        public string PasswordHash { get; set; } = string.Empty;


    }
}
