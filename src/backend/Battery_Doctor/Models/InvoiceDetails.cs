using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class InvoiceDetails
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("invoice_details_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Invoice")]
        public int InvoiceId { get; set; }

        [Required]
        [ForeignKey("Asset")]
        [Column("asset_id", TypeName = "int(10)")]
        public int AssetId { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Required]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public virtual Invoice Invoice { get; set; }

        public virtual Asset Asset { get; set; }
    }
}