using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Battery_Doctor.Models
{
    public class PaymentMethod
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("payment_method_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [Column("method", TypeName = "varchar(255)")]
        public string Method { get; set; }

        [AllowNull]
        [InverseProperty(nameof(Invoice.PaymentMethod))]
        public ICollection<Invoice> Invoices { get; set; }
    }
}
