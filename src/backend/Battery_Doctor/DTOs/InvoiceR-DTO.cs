using Battery_Doctor.Models;

namespace Battery_Doctor.DTOs
{
    public class InvoiceR_DTO
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public string PaymentMethodR { get; set; }

        public DateTime DateOfSale { get; set; }

        public float TotalPrice { get; set; }

        public List<string> AssetNames { get; set; }
    }
}
