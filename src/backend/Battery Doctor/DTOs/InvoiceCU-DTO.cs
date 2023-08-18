namespace Battery_Doctor.DTOs
{
    public class InvoiceCU_DTO
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public string PaymentMethodR { get; set; }

        public float TotalPrice { get; set; }
    }
}
