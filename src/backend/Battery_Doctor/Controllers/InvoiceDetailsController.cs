using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;


namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceDetailsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public InvoiceDetailsController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/InvoiceDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDetails>>> GetInvoiceDetails()
        {
            return await _context.Invoice_Details.Include(i => i.Invoice)
                                                 .Include(a => a.Asset)
                                                 .ToListAsync();
        }

        // GET: api/InvoiceDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDetails>> GetInvoiceDetails(int id)
        {
            var invoiceDetails = await _context.Invoice_Details.Include(i => i.Invoice)
                                                              .Include(a => a.Asset)
                                                              .FirstOrDefaultAsync(invDet => invDet.Id == id);

            if (invoiceDetails == null)
            {
                return NotFound();
            }

            return invoiceDetails;
        }

        // POST: api/InvoiceDetails
        [HttpPost]
        public async Task<ActionResult<InvoiceDetails>> PostInvoiceDetails(InvoiceDetails invoiceDetails)
        {
            invoiceDetails.CreatedAt = DateTime.UtcNow;
            invoiceDetails.UpdatedAt = DateTime.UtcNow;
            _context.Invoice_Details.Add(invoiceDetails);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoiceDetails), new { id = invoiceDetails.Id }, invoiceDetails);
        }

        // PUT: api/InvoiceDetails/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoiceDetails(int id, InvoiceDetails invoiceDetails)
        {
            if (id != invoiceDetails.Id)
            {
                return BadRequest();
            }

            invoiceDetails.UpdatedAt = DateTime.UtcNow;
            _context.Entry(invoiceDetails).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceDetailsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/InvoiceDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoiceDetails(int id)
        {
            var invoiceDetails = await _context.Invoice_Details.FindAsync(id);
            if (invoiceDetails == null)
            {
                return NotFound();
            }

            _context.Invoice_Details.Remove(invoiceDetails);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InvoiceDetailsExists(int id)
        {
            return _context.Invoice_Details.Any(e => e.Id == id);
        }
    }
}
