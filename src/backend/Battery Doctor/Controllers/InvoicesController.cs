using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public InvoicesController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceR_DTO>>> GetInvoices()
        {
            var invoices =  await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.PaymentMethod)
                .Include(i => i.InvoiceDetails)
                .ToListAsync();

            var invoiceReadDtos = invoices.Select(i => new InvoiceR_DTO
            {
                Id = i.Id,
                CustomerId = i.CustomerId,
                PaymentMethodR = _context.Payment_Methods.FirstOrDefault(x => x.Id == i.PaymentMethodId).Method,
                DateOfSale= i.DateOfSale,
                TotalPrice= i.TotalPrice,
            }).ToList();

            return invoiceReadDtos;

        }

        // GET: api/Invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceR_DTO>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.PaymentMethod)
                .Include(i => i.InvoiceDetails)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            var invoiceReadDto = new InvoiceR_DTO
            {
                Id = invoice.Id,
                CustomerId = invoice.CustomerId,
                PaymentMethodR = _context.Payment_Methods.FirstOrDefault(x => x.Id == invoice.PaymentMethodId).Method,
                DateOfSale = invoice.DateOfSale,
                TotalPrice = invoice.TotalPrice,
            };

            return invoiceReadDto;
        }

        // POST: api/Invoices
        [HttpPost]
        public async Task<ActionResult<InvoiceCU_DTO>> PostInvoice(InvoiceCU_DTO invoiceDto)
        {
            PaymentMethod? paymentMethod = (PaymentMethod?)_context.Payment_Methods.FirstOrDefault(n => n.Method == invoiceDto.PaymentMethodR);

            if(paymentMethod == null)
            {
                paymentMethod = new PaymentMethod
                {
                    Method = invoiceDto.PaymentMethodR
                };
                _context.Payment_Methods.Add(paymentMethod);
                await _context.SaveChangesAsync();
            }

            var invoice = new Invoice
            {
                Id = invoiceDto.Id,
                CustomerId = invoiceDto.CustomerId,
                PaymentMethodId = paymentMethod.Id,
                DateOfSale = DateTime.Now,
                TotalPrice = invoiceDto.TotalPrice,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            var invoiceReadDto = new InvoiceR_DTO
            {
                Id = invoice.Id,
                CustomerId = invoice.CustomerId,
                PaymentMethodR = _context.Payment_Methods.FirstOrDefault(x => x.Id == invoice.PaymentMethodId).Method,
                DateOfSale = invoice.DateOfSale,
                TotalPrice = invoice.TotalPrice,
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoiceReadDto);
        }

        // PUT: api/Invoices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoice(int id, InvoiceCU_DTO invoiceDto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if(invoice == null)
            {
                return NotFound();
            }

            PaymentMethod? paymentMethod = (PaymentMethod?)_context.Payment_Methods.FirstOrDefault(n => n.Method == invoiceDto.PaymentMethodR);

            if(paymentMethod == null)
            {
                paymentMethod = new PaymentMethod
                {
                    Method = invoiceDto.PaymentMethodR
                };
                _context.Payment_Methods.Add(paymentMethod);
                await _context.SaveChangesAsync();
            }

            invoice.UpdatedAt = DateTime.Now;
            invoice.TotalPrice = invoiceDto.TotalPrice;
            invoice.PaymentMethodId = paymentMethod.Id;
            invoice.CustomerId = invoiceDto.CustomerId;

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceExists(id))
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

        // DELETE: api/Invoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InvoiceExists(int id)
        {
            return _context.Invoices.Any(e => e.Id == id);
        }
    }
}
