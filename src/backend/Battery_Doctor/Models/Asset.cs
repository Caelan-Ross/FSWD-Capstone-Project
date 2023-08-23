using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Asset
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("asset_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Column("qr_code", TypeName = "varchar(100)")]
        [StringLength(100)]
        public string QRCode { get; set; }

        [Required]
        [ForeignKey("Battery")]
        [Column("battery_id", TypeName = "int(10)")]
        public int BatteryId { get; set; }

        [Required]
        [Column("warranty_date")]
        public DateTime WarrantyDate { get; set; }

        [Required]
        [Column("stamped_serial", TypeName = "varchar(50)")]
        [StringLength(7)]
        public string StampedSerial { get; set; }

        [ForeignKey("Customer")]
        [Required]
        [Column("customer_id", TypeName = "int(10)")]
        public int CustomerId { get; set; }  

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Required]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public virtual Battery Battery { get; set; }

        public virtual Customer Customer { get; set; }
    }
}


