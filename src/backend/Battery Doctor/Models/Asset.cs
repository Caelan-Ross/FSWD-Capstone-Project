using System;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.Models
{
    public class Asset
    {
        [Key]
        public int Id { get; set; }

        [StringLength(100)]
        public string QRCode { get; set; }

        [Required]
        public int BatteryId { get; set; }

        [Required]
        public DateTime WarrantyDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        public int? CustomerId { get; set; }  

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        public Battery Battery { get; set; }

        public Customer Customer { get; set; }
    }
}


