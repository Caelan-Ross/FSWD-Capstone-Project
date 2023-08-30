using System;

namespace Battery_Doctor.DTOs
{
    public class PurchaseOrderReadDto
    {
        public int Id { get; set; }

        public int SupplierId { get; set; }

        public DateTime DateOfOrder { get; set; }

        public DateTime DateOfDelivery { get; set; }

        public bool IsVerified { get; set; }

        public SupplierReadDto Supplier { get; set; }

        public List<PurchaseOrderDetailsReadDto> PurchaseOrderDetails { get; set; }
    }
}

