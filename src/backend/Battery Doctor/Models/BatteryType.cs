using System;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.Models
{
    public class BatteryType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string TypeName { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }
    }
}
