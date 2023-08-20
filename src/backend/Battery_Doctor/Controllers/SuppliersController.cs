using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System;
using Battery_Doctor.DTOs;
using Battery_Doctor.Models;
using Battery_Doctor.Data;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public SuppliersController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Suppliers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierReadDto>>> GetSuppliers()
        {
            return await _context.Suppliers.Include(s => s.Address).Select(s => new SupplierReadDto
            {
                Id = s.Id,
                Name = s.Name,
                ContactFirstName = s.ContactFirstName,
                ContactLastName = s.ContactLastName,
                ContactPhone = s.ContactPhone,
                ContactEmail = s.ContactEmail,
                Address = new AddressDto
                {
                    Id = s.Address.Id,
                    Street = s.Address.Street,
                    City = s.Address.City,
                    Province = s.Address.Province,
                    Country = s.Address.Country,
                    PostalCode = s.Address.PostalCode
                }
            }).ToListAsync();
        }

        // GET: api/Suppliers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierReadDto>> GetSupplier(int id)
        {
            var supplier = await _context.Suppliers.Include(s => s.Address)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (supplier == null)
            {
                return NotFound();
            }

            var supplierReadDto = new SupplierReadDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactFirstName = supplier.ContactFirstName,
                ContactLastName = supplier.ContactLastName,
                ContactPhone = supplier.ContactPhone,
                ContactEmail = supplier.ContactEmail,
                Address = new AddressDto
                {
                    Id = supplier.Address.Id,
                    Street = supplier.Address.Street,
                    City = supplier.Address.City,
                    Province = supplier.Address.Province,
                    Country = supplier.Address.Country,
                    PostalCode = supplier.Address.PostalCode
                }
            };

            return supplierReadDto;
        }

        // POST: api/Suppliers
        [HttpPost]
        public async Task<ActionResult<Supplier>> PostSupplier(SupplierCreateUpdateDto supplierCreateDto)
        {
            var supplier = new Supplier
            {
                Name = supplierCreateDto.Name,
                ContactFirstName = supplierCreateDto.ContactFirstName,
                ContactLastName = supplierCreateDto.ContactLastName,
                ContactPhone = supplierCreateDto.ContactPhone,
                ContactEmail = supplierCreateDto.ContactEmail,
                AddressId = supplierCreateDto.AddressId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, supplier);
        }

        // PUT: api/Suppliers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSupplier(int id, SupplierCreateUpdateDto supplierUpdateDto)
        {
            var supplier = await _context.Suppliers.FindAsync(id);

            if (supplier == null)
            {
                return NotFound();
            }

            supplier.Name = supplierUpdateDto.Name;
            supplier.ContactFirstName = supplierUpdateDto.ContactFirstName;
            supplier.ContactLastName = supplierUpdateDto.ContactLastName;
            supplier.ContactPhone = supplierUpdateDto.ContactPhone;
            supplier.ContactEmail = supplierUpdateDto.ContactEmail;
            supplier.AddressId = supplierUpdateDto.AddressId;
            supplier.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplierExists(id))
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

        // DELETE: api/Suppliers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
            {
                return NotFound();
            }

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SupplierExists(int id)
        {
            return _context.Suppliers.Any(e => e.Id == id);
        }
    }
}
