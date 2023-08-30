
namespace Battery_Doctor.DTOs
{
    public class InvoiceR_DTO
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public string PaymentMethodR { get; set; }

        public DateTime DateOfSale { get; set; }

        public float TotalPrice { get; set; }

        public float CashAmount { get; set; }

        public float DebitAmount { get; set; }

        public float CreditAmount { get; set; }

        public float CustomerCreditAmount { get; set; }

        public float TaxRate { get; set; }

        public string Notes { get; set; }

        public List<int> AssetIds { get; set; }
    }
}
