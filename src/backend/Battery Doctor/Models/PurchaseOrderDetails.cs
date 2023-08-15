using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class PurchaseOrderDetails
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("customer_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("PurchaseOrder")]
        [Column("purchase_order_id", TypeName = "int(10)")]
        public int PurchaseOrderId { get; set; }

        [Required]
        [ForeignKey("Battery")]
        [Column("battery_id", TypeName = "int(10)")]
        public int BatteryId { get; set; }

        [Required]
        [Column("quantity_ordered", TypeName = "int(10)")]
        public int QuantityOrdered { get; set; }

        [Required]
        [Column("price_per_battery")]
        public float PricePerBattery { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Required]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public virtual PurchaseOrder PurchaseOrder { get; set; }

        public virtual Battery Battery { get; set; }
    }
}

