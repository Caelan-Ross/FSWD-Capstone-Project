using System;

namespace Battery_Doctor.DTOs
{
    public class PurchaseOrderDetailsCreateUpdateDto
    {
        public int PurchaseOrderId { get; set; }

        public int BatteryId { get; set; }

        public int QuantityOrdered { get; set; }

        public float PricePerBattery { get; set; }
    }
}

