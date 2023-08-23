using Battery_Doctor.Models;

namespace Battery_Doctor.DTOs
{
    public class InvoiceC_DTO
    {
        public int CustomerId { get; set; }

        public string PaymentMethodR { get; set; }

        public float TotalPrice { get; set; }

        public List<int> AssetIds { get; set; }
    }
}
