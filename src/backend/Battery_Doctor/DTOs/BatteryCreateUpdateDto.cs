using System;
namespace Battery_Doctor.DTOs
{
    public class BatteryCreateUpdateDto
    {
        public string TypeName { get; set; }

        public string ModelName { get; set; }

        public string MakeName { get; set; }

        //public int GroupId { get; set; }

        public float Voltage { get; set; }

        public float Capacity { get; set; }

        public float Price { get; set; }

        public int QuantityOnHand { get; set; }

    }
}

