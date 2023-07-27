using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class PurchaseOrderDetails
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [ForeignKey("PurchaseOrder")]
        public int PurchaseOrderId { get; set; }
        [Required]
        [ForeignKey("Battery")]
        public int BatteryId { get; set; }
        [Required]
        public int QuantityOrdered { get; set; }
        [Required]
        public float PricePerBattery { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public PurchaseOrder PurchaseOrder { get; set; }
        public Battery Battery { get; set; }
    }
}

