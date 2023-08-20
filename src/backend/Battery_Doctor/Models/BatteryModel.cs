using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class BatteryModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("model_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [Column("first_name", TypeName = "varchar(255)")]
        public string ModelName { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [ForeignKey("BatteryMake")]
        [Column("make_id", TypeName = "int(10)")]
        public int BatteryMakeId { get; set; }

        public virtual BatteryMake BatteryMake { get; set; }
    }
}
