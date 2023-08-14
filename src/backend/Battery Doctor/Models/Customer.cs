using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("customer_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [Phone]
        [MaxLength(20)]  // adjust this to an appropriate size based on the phone number formats you're using
        [Column("phone_number", TypeName = "varchar(20)")]
        public string PhoneNumber { get; set; }

        [Required]
        [Column("first_name", TypeName = "varchar")]
        public string FirstName { get; set; }

        [Required]
        [Column("last_name", TypeName = "varchar")]
        public string LastName { get; set; }

        [EmailAddress]
        [Column("email")]
        public string Email { get; set; }

        [ForeignKey("Address")]
        [Column("address_id", TypeName = "int(10)")]
        public int? AddressId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public Address? Address { get; set; }
    }
}

