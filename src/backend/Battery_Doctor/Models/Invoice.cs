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

        [AllowNull]
        [Column("notes", TypeName = "varchar(500)")]
        public string? Notes { get; set; }

        [Required]
        [Column("date_of_sale")]
        public DateTime DateOfSale { get; set; }

        [AllowNull]
        [Column("cash_amount")]
        public float CashAmount { get; set; }

        [AllowNull]
        [Column("debit_amount")]
        public float DebitAmount { get; set; }

        [AllowNull]
        [Column("credit_amount")]
        public float CreditAmount { get; set; }

        [AllowNull]
        [Column("customer_credit_amount")]
        public float CustomerCreditAmount { get; set; }

        [Required]
        [Column("total_price")]
        public float TotalPrice { get; set; }

        [Required]
        [Column("tax_rate")]
        public float TaxRate { get; set; }

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