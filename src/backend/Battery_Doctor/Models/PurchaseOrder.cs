using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Battery_Doctor.Models
{
    public class PurchaseOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("purchase_order_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Supplier")]
        [Column("supplier_id", TypeName = "int(10)")]
        public int SupplierId { get; set; }

        [Required]
        [Column("date_of_order")]
        public DateTime DateOfOrder { get; set; }

        [Column("date_of_delivery")]
        public DateTime DateOfDelivery { get; set; }

        [Column("is_verfied")]
        public bool IsVerified { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Required]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public virtual Supplier Supplier { get; set; }

        [AllowNull]
        [InverseProperty(nameof(Models.PurchaseOrderDetails.PurchaseOrder))]
        public ICollection<PurchaseOrderDetails> PurchaseOrderDetails { get; set; }
    }
}
