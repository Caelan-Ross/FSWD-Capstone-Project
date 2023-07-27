using System;

namespace Battery_Doctor.DTOs
{
    public class PurchaseOrderCreateUpdateDto
    {
        public int SupplierId { get; set; }
        public DateTime DateOfOrder { get; set; }
        public DateTime DateOfDelivery { get; set; }
        public bool IsVerified { get; set; }
    }
}

