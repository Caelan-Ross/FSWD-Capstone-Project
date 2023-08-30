using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;


namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMethodsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public PaymentMethodsController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/PaymentMethods
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentMethod>>> GetPaymentMethods()
        {
            return await _context.Payment_Methods.Include(pm => pm.Invoices).ToListAsync();
        }

        // GET: api/PaymentMethods/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentMethod>> GetPaymentMethod(int id)
        {
            var paymentMethod = await _context.Payment_Methods.Include(pm => pm.Invoices)
                .FirstOrDefaultAsync(pm => pm.Id == id);

            if (paymentMethod == null)
            {
                return NotFound();
            }

            return paymentMethod;
        }

        // POST: api/PaymentMethods
        [HttpPost]
        public async Task<ActionResult<PaymentMethod>> PostPaymentMethod(PaymentMethod paymentMethod)
        {
            _context.Payment_Methods.Add(paymentMethod);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPaymentMethod), new { id = paymentMethod.Id }, paymentMethod);
        }

        // PUT: api/PaymentMethods/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymentMethod(int id, PaymentMethod paymentMethod)
        {
            if (id != paymentMethod.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymentMethod).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentMethodExists(id))
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

        // DELETE: api/PaymentMethods/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentMethod(int id)
        {
            var paymentMethod = await _context.Payment_Methods.FindAsync(id);
            if (paymentMethod == null)
            {
                return NotFound();
            }

            _context.Payment_Methods.Remove(paymentMethod);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentMethodExists(int id)
        {
            return _context.Payment_Methods.Any(e => e.Id == id);
        }
    }
}
