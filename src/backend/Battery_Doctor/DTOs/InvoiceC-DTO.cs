
namespace Battery_Doctor.DTOs
{
    public class InvoiceC_DTO
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string PaymentMethodR { get; set; }

        public float CashAmount { get; set; }

        public float DebitAmount { get; set; }

        public float CreditAmount { get; set; }

        public float CustomerCreditAmount { get; set; }

        public float TaxRate { get; set; }

        public string Notes { get; set; }

        public float TotalPrice { get; set; }

        public List<int> AssetIds { get; set; }
    }
}
