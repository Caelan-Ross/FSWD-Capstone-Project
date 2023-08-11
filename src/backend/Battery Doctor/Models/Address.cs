using System;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }

        [StringLength(100)]
        public string Street { get; set; }

        [StringLength(50)]
        public string City { get; set; }

        [StringLength(50)]
        public string Province { get; set; }

        [StringLength(10)]
        public string PostalCode { get; set; }

        [StringLength(50)]
        public string Country { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}


