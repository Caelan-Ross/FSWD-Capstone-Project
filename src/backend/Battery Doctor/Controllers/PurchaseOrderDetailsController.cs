using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrderDetailsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public PurchaseOrderDetailsController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/PurchaseOrderDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseOrderDetailsReadDto>>> GetPurchaseOrderDetails()
        {
            var purchaseOrderDetails = await _context.Purchase_Order_Details.ToListAsync();

            var purchaseOrderDetailDtos = purchaseOrderDetails.Select(detail => new PurchaseOrderDetailsReadDto
            {
                Id = detail.Id,
                PurchaseOrderId = detail.PurchaseOrderId,
                BatteryId = detail.BatteryId,
                QuantityOrdered = detail.QuantityOrdered,
                PricePerBattery = detail.PricePerBattery,
            }).ToList();

            return Ok(purchaseOrderDetailDtos);
        }

        // GET: api/PurchaseOrderDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseOrderDetailsReadDto>> GetPurchaseOrderDetails(int id)
        {
            var purchaseOrderDetails = await _context.Purchase_Order_Details.FindAsync(id);

            if (purchaseOrderDetails == null)
            {
                return NotFound();
            }

            var purchaseOrderDetailDto = new PurchaseOrderDetailsReadDto
            {
                Id = purchaseOrderDetails.Id,
                PurchaseOrderId = purchaseOrderDetails.PurchaseOrderId,
                BatteryId = purchaseOrderDetails.BatteryId,
                QuantityOrdered = purchaseOrderDetails.QuantityOrdered,
                PricePerBattery = purchaseOrderDetails.PricePerBattery,
            };

            return Ok(purchaseOrderDetailDto);
        }

        // POST: api/PurchaseOrderDetails
        [HttpPost]
        public async Task<ActionResult<PurchaseOrderDetails>> PostPurchaseOrderDetails(PurchaseOrderDetailsCreateUpdateDto purchaseOrderDetailDto)
        {
            var purchaseOrderDetails = new PurchaseOrderDetails
            {
                PurchaseOrderId = purchaseOrderDetailDto.PurchaseOrderId,
                BatteryId = purchaseOrderDetailDto.BatteryId,
                QuantityOrdered = purchaseOrderDetailDto.QuantityOrdered,
                PricePerBattery = purchaseOrderDetailDto.PricePerBattery,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Purchase_Order_Details.Add(purchaseOrderDetails);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPurchaseOrderDetails), new { id = purchaseOrderDetails.Id }, purchaseOrderDetails);
        }

        // PUT: api/PurchaseOrderDetails/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPurchaseOrderDetails(int id, PurchaseOrderDetailsCreateUpdateDto purchaseOrderDetailDto)
        {
            var purchaseOrderDetails = await _context.Purchase_Order_Details.FindAsync(id);

            if (purchaseOrderDetails == null)
            {
                return NotFound();
            }

            purchaseOrderDetails.PurchaseOrderId = purchaseOrderDetailDto.PurchaseOrderId;
            purchaseOrderDetails.BatteryId = purchaseOrderDetailDto.BatteryId;
            purchaseOrderDetails.QuantityOrdered = purchaseOrderDetailDto.QuantityOrdered;
            purchaseOrderDetails.PricePerBattery = purchaseOrderDetailDto.PricePerBattery;
            purchaseOrderDetails.UpdatedAt = DateTime.UtcNow;

            _context.Entry(purchaseOrderDetails).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PurchaseOrderDetailsExists(id))
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

        // DELETE: api/PurchaseOrderDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePurchaseOrderDetails(int id)
        {
            var purchaseOrderDetails = await _context.Purchase_Order_Details.FindAsync(id);
            if (purchaseOrderDetails == null)
            {
                return NotFound();
            }

            _context.Purchase_Order_Details.Remove(purchaseOrderDetails);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PurchaseOrderDetailsExists(int id)
        {
            return _context.Purchase_Order_Details.Any(e => e.Id == id);
        }
    }
}
