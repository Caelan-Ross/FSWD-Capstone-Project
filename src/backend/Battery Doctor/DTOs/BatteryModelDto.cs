using System;
namespace Battery_Doctor.DTOs
{
    public class BatteryModelDto
    {
        public int Id { get; set; }
        public string ModelName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int BatteryMakeId { get; set; }
    }
}

