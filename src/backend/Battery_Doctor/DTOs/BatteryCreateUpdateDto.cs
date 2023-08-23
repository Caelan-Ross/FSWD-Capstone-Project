
namespace Battery_Doctor.DTOs
{
    public class BatteryCreateUpdateDto
    {
        public string TypeName { get; set; }

        public string ModelName { get; set; }

        public string MakeName { get; set; }

        public string ConditionName { get; set; }

        public float Voltage { get; set; }

        public float Capacity { get; set; }

        public float Price { get; set; }

        public string GroupName { get; set; }

        public float Length { get; set; }

        public float Width { get; set; }

        public float Height { get; set; }

        public string UnitType { get; set; }

        public string StampedSerial { get; set; }
    }
}

