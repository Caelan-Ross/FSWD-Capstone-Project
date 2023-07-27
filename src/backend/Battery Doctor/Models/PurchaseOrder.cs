using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class PurchaseOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Supplier")]
        public int SupplierId { get; set; }

        [Required]
        public DateTime DateOfOrder { get; set; }

        public DateTime DateOfDelivery { get; set; }

        public bool IsVerified { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public Supplier Supplier { get; set; }
        public List<PurchaseOrderDetails> PurchaseOrderDetails { get; set; }
    }
}
