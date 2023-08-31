using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Supplier
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("supplier_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [Column("name", TypeName = "varchar(255)")]
        public string Name { get; set; }

        [Column("first_name", TypeName = "varchar(255)")]
        public string ContactFirstName { get; set; }

        [Column("last_name", TypeName = "varchar(255)")]
        public string ContactLastName { get; set; }

        [Required]
        [Phone]
        [Column("phone_number", TypeName = "varchar(20)")]
        public string ContactPhone { get; set; }

        [EmailAddress]
        [Column("email", TypeName = "varchar(255)")]
        public string ContactEmail { get; set; }

        [Required]
        [ForeignKey("Address")]
        [Column("address_id", TypeName = "int(10)")]
        public int AddressId { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Required]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public virtual Address Address { get; set; }
    }
}
