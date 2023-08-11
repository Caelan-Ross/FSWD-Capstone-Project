﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public CustomersController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerReadDto>>> GetAllCustomers()
        {
            var customers = await _context.Customers.Include(c => c.Address).ToListAsync();

            var customerDtos = customers.Select(c => new CustomerReadDto
            {
                Id = c.Id,
                PhoneNumber = c.PhoneNumber,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email
            }).ToList();

            return customerDtos;
        }

        // GET: api/Customers/5
        [HttpGet("{phoneNumber}")]
        public async Task<ActionResult<CustomerReadDto>> GetCustomer(string phoneNumber)
        {
            var customer = await _context.Customers.Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.PhoneNumber == phoneNumber);

            if (customer == null)
            {
                return NotFound();
            }

            var customerDto = new CustomerReadDto
            {
                Id = customer.Id,
                PhoneNumber = customer.PhoneNumber,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email
            };

            return customerDto;
        }

        // POST: api/Customers
        [HttpPost]
        public async Task<ActionResult<CustomerReadDto>> CreateCustomer(CustomerCreateDto customerDto)
        {
            var customer = new Customer
            {
                PhoneNumber = customerDto.PhoneNumber,
                FirstName = customerDto.FirstName,
                LastName = customerDto.LastName,
                Email = customerDto.Email,
                Address = null,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var readDto = new CustomerCreateDto
            {
                PhoneNumber = customer.PhoneNumber,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
            };

            return CreatedAtAction(nameof(GetCustomer), new { phoneNumber = customer.PhoneNumber }, readDto);
        }

        // PUT: api/Customers/5
        [HttpPut("{phoneNumber}")]
        public async Task<IActionResult> UpdateCustomer(CustomerCreateDto customerDto)
        {
            var customer = await _context.Customers.Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.PhoneNumber == customerDto.PhoneNumber);

            if (customer == null)
            {
                return NotFound();
            }

            customer.FirstName = customerDto.FirstName;
            customer.LastName = customerDto.LastName;
            customer.Email = customerDto.Email;

            customer.Address = null;

            customer.UpdatedAt = DateTime.Now;
            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(customerDto.PhoneNumber))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(500, "An error occurred while updating the data. Please try again.");
                }
            }

            return NoContent();
        }

        // DELETE: api/Customers/5
        [HttpDelete("{phoneNumber}")]
        public async Task<IActionResult> DeleteCustomer(string phoneNumber)
        {
            var customer = await _context.Customers.FindAsync(phoneNumber);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerExists(string phoneNumber)
        {
            return _context.Customers.Any(e => e.PhoneNumber == phoneNumber);
        }
    }
}