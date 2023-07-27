using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.Models
{
    public class BatteryMake
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation property
        public ICollection<BatteryModel> BatteryModels { get; set; }
    }
}

