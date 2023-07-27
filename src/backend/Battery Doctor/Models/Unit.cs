using System;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.Models
{
    public class Unit
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string UnitType { get; set; }
    }
}
