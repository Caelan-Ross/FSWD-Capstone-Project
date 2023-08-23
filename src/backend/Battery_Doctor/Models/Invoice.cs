using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Battery_Doctor.Models
{
    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("invoice_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Customer")]
        [Column("customer_id", TypeName = "int(10)")]
        public int CustomerId { get; set; }

        [Required]
        [ForeignKey("PaymentMethod")]
        [Column("payment_method_id", TypeName = "int(10)")]
        public int PaymentMethodId { get; set; }

        [Required]
        [Column("date_of_sale")]
        public DateTime DateOfSale { get; set; }

        [Required]
        [Column("total_price")]
        public float TotalPrice { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Required]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public virtual Customer Customer { get; set; }

        public virtual PaymentMethod PaymentMethod { get; set; }

        [InverseProperty(nameof(Models.InvoiceDetails.Invoice))]
        public virtual ICollection<InvoiceDetails> InvoiceDetails { get; set; }
    }
}