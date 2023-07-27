using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Phone]
        [MaxLength(20)]  // adjust this to an appropriate size based on the phone number formats you're using
        public string PhoneNumber { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [ForeignKey("Address")]
        public int AddressId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Address Address { get; set; }
    }
}

