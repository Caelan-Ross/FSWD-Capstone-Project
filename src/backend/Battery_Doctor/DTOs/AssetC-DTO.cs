using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.DTOs
{
    public class AssetC_DTO
    {
        public int Id { get; set; }

        public string QRCode { get; set; }

        public int BatteryId { get; set; }

        public string StampedSerial { get; set; }

        public int CustomerId { get; set; }

        public int InvoiceId { get; set; }

    }
}
