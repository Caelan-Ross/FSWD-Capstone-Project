using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Battery_Doctor.Models
{
    public class BatteryMake
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("make_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [Column("last_name", TypeName = "varchar(255)")]
        public string Name { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [AllowNull]
        [InverseProperty(nameof(BatteryModel.BatteryMake))]
        public ICollection<BatteryModel> BatteryModels { get; set; }
    }
}

