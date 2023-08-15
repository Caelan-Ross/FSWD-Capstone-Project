using System;
namespace Battery_Doctor.DTOs
{
    public class BatteryMakeDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}

