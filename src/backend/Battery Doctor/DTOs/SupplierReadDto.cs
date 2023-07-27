using System;

namespace Battery_Doctor.DTOs
{
    public class SupplierReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ContactFirstName { get; set; }
        public string ContactLastName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEmail { get; set; }
        public AddressDto Address { get; set; }
    }
}

