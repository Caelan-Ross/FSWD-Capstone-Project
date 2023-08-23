namespace Battery_Doctor.DTOs
{
    public class InvoiceU_DTO
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public string PaymentMethodR { get; set; }

        public float TotalPrice { get; set; }

        public List<int> AssetIds { get; set; }
    }
}
