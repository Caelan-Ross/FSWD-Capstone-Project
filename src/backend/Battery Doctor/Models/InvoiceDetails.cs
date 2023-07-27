using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class InvoiceDetails
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Invoice")]
        public int InvoiceId { get; set; }

        [Required]
        [ForeignKey("Asset")]
        public int AssetId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public Invoice Invoice { get; set; }
        public Asset Asset { get; set; }
    }
}