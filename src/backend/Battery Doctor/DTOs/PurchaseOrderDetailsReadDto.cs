using System;

namespace Battery_Doctor.DTOs
{
    public class PurchaseOrderDetailsReadDto
    {
        public int Id { get; set; }
        public int PurchaseOrderId { get; set; }
        public int BatteryId { get; set; }
        public int QuantityOrdered { get; set; }
        public float PricePerBattery { get; set; }
        public PurchaseOrderReadDto PurchaseOrder { get; set; }
        public BatteryReadDto Battery { get; set; }
    }
}

