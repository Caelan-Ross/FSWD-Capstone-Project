using System;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.Models
{
    public class BatteryModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string ModelName { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Foreign key
        [Required]
        public int BatteryMakeId { get; set; }

        // Navigation property
        public BatteryMake BatteryMake { get; set; }
    }
}
