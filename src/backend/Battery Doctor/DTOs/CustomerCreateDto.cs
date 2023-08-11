﻿using System;
using System.ComponentModel.DataAnnotations;

namespace Battery_Doctor.DTOs
{
    public class CustomerCreateDto
    {
        public string PhoneNumber { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }
    }
}

