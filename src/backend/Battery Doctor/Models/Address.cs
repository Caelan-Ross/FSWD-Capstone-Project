using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Address
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("address_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [Column("street", TypeName = "varchar(100)")]
        [StringLength(100)]
        public string Street { get; set; }

        [Required]
        [Column("city", TypeName = "varchar(50)")]
        [StringLength(50)]
        public string City { get; set; }

        [Required]
        [Column("province", TypeName = "varchar(50)")]
        [StringLength(50)]
        public string Province { get; set; }

        [Required]
        [Column("postal_code", TypeName = "varchar(10)")]
        [StringLength(10)]
        public string PostalCode { get; set; }

        [Required]
        [Column("country", TypeName = "varchar(50)")]
        [StringLength(50)]
        public string Country { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime UpdatedAt { get; set; }
    }
}


