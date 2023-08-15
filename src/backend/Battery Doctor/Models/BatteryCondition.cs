using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations.Schema;

using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.Models
{
    public class BatteryCondition
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("condition_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [Column("condition_name", TypeName = "varchar(255)")]
        public string ConditionName { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

    }
}

