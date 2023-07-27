using System;
namespace Battery_Doctor.DTOs
{
    public class BatteryCreateUpdateDto
    {
        public int TypeId { get; set; }

        public int ModelId { get; set; }

        public int MakeId { get; set; }

        public float Voltage { get; set; }

        public float Capacity { get; set; }

        public float Price { get; set; }

        public int QuantityOnHand { get; set; }

        public int GroupId { get; set; }
    }
}

