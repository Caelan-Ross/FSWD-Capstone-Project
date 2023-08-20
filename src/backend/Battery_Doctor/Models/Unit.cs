using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Unit
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("unit_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [Column("unit_type", TypeName = "varchar(255)")]
        public string UnitType { get; set; }
    }
}
