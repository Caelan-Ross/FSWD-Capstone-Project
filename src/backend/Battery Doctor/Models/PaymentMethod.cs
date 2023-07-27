using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.Models
{
    public class PaymentMethod
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Method { get; set; }

        // Navigation property
        public List<Invoice> Invoices { get; set; }
    }
}
