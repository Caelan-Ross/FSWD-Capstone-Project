namespace Battery_Doctor.DTOs
{
    public class AssetR_DTO
    {
        public int Id { get; set; }

        public string QRCode { get; set; }

        public string BatteryName { get; set; }

        public string StampedSerial { get; set; }

        public float Price { get; set; }

        public DateTime WarrantyDate { get; set; }

    }
}
