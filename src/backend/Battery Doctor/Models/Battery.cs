using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Battery
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TypeId { get; set; }

        [Required]
        public int ModelId { get; set; }

        [Required]
        public int MakeId { get; set; }

        [Required, Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
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


