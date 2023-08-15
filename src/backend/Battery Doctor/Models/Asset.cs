using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

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

        [AllowNull]
        [ForeignKey("Customer")]
        [Column("customer_id", TypeName = "int(10)")]
        public int? CustomerId { get; set; }  

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        public Battery Battery { get; set; }

        public virtual Customer? Customer { get; set; }
    }
}


