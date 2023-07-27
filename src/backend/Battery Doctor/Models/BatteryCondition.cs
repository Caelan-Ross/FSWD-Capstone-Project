using System;
namespace Battery_Doctor.Models
{
    public class BatteryCondition
    {
        public int Id { get; set; }
        public string ConditionName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}

