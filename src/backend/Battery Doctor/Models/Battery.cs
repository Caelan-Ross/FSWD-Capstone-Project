using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Battery
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("battery_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [ForeignKey("BatteryType")]
        [Column("type_id", TypeName = "int(10)")]
        public int TypeId { get; set; }

        [Required]
        [ForeignKey("BatteryModel")]
        [Column("model_id", TypeName = "int(10)")]
        public int ModelId { get; set; }

        [Required]
        [ForeignKey("BatteryMake")]
        [Column("make_id", TypeName = "int(10)")]
        public int MakeId { get; set; }

        [Required, Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
        [Column("voltage", TypeName = "float5")]
        public float Voltage { get; set; }

        [Required, Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
        public float Capacity { get; set; }

        [Required, Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
        public float Price { get; set; }

        [Required, Range(0, int.MaxValue, ErrorMessage = "Please enter a valid quantity")]
        public int QuantityOnHand { get; set; }

        [Required]
        [ForeignKey("BatteryGroup")]
        public int GroupId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation property
        public BatteryType BatteryType { get; set; }

        public BatteryModel BatteryModel { get; set; }

        public BatteryMake BatteryMake { get; set; }

        public BatteryGroup BatteryGroup { get; set; }
    }
}


