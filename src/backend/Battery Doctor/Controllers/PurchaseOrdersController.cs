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
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public PurchaseOrdersController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/PurchaseOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseOrderReadDto>>> GetPurchaseOrders()
        {
            var purchaseOrders = await _context.Purchase_Orders.Include(p => p.PurchaseOrderDetails).ToListAsync();

            var purchaseOrderDtos = purchaseOrders.Select(purchaseOrder => new PurchaseOrderReadDto
            {
                Id = purchaseOrder.Id,
                SupplierId = purchaseOrder.SupplierId,
                DateOfOrder = purchaseOrder.DateOfOrder,
                DateOfDelivery = purchaseOrder.DateOfDelivery,
                IsVerified = purchaseOrder.IsVerified,
                PurchaseOrderDetails = purchaseOrder.PurchaseOrderDetails.Select(detail => new PurchaseOrderDetailsReadDto
                {
                    Id = detail.Id,
                    PurchaseOrderId = detail.PurchaseOrderId,
                    BatteryId = detail.BatteryId,
                    QuantityOrdered = detail.QuantityOrdered,
                    PricePerBattery = detail.PricePerBattery,
                }).ToList()
            }).ToList();

            return Ok(purchaseOrderDtos);
        }

        // GET: api/PurchaseOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseOrderReadDto>> GetPurchaseOrder(int id)
        {
            var purchaseOrder = await _context.Purchase_Orders.Include(p => p.PurchaseOrderDetails)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (purchaseOrder == null)
            {
                return NotFound();
            }

            var purchaseOrderDto = new PurchaseOrderReadDto
            {
                Id = purchaseOrder.Id,
                SupplierId = purchaseOrder.SupplierId,
                DateOfOrder = purchaseOrder.DateOfOrder,
                DateOfDelivery = purchaseOrder.DateOfDelivery,
                IsVerified = purchaseOrder.IsVerified,
                PurchaseOrderDetails = purchaseOrder.PurchaseOrderDetails.Select(detail => new PurchaseOrderDetailsReadDto
                {
                    Id = detail.Id,
                    PurchaseOrderId = detail.PurchaseOrderId,
                    BatteryId = detail.BatteryId,
                    QuantityOrdered = detail.QuantityOrdered,
                    PricePerBattery = detail.PricePerBattery,
                }).ToList()
            };

            return Ok(purchaseOrderDto);
        }

        // POST: api/PurchaseOrders
        [HttpPost]
        public async Task<ActionResult<PurchaseOrder>> PostPurchaseOrder(PurchaseOrderCreateUpdateDto purchaseOrderDto)
        {
            var purchaseOrder = new PurchaseOrder
            {
                SupplierId = purchaseOrderDto.SupplierId,
                DateOfOrder = purchaseOrderDto.DateOfOrder,
                DateOfDelivery = purchaseOrderDto.DateOfDelivery,
                IsVerified = purchaseOrderDto.IsVerified,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Purchase_Orders.Add(purchaseOrder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPurchaseOrder), new { id = purchaseOrder.Id }, purchaseOrder);
        }

        // PUT: api/PurchaseOrders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPurchaseOrder(int id, PurchaseOrderCreateUpdateDto purchaseOrderDto)
        {
            var purchaseOrder = await _context.Purchase_Orders.FindAsync(id);

            if (purchaseOrder == null)
            {
                return NotFound();
            }

            purchaseOrder.SupplierId = purchaseOrderDto.SupplierId;
            purchaseOrder.DateOfOrder = purchaseOrderDto.DateOfOrder;
            purchaseOrder.DateOfDelivery = purchaseOrderDto.DateOfDelivery;
            purchaseOrder.IsVerified = purchaseOrderDto.IsVerified;
            purchaseOrder.UpdatedAt = DateTime.UtcNow;

            _context.Entry(purchaseOrder).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PurchaseOrderExists(id))
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

        // DELETE: api/PurchaseOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePurchaseOrder(int id)
        {
            var purchaseOrder = await _context.Purchase_Orders.FindAsync(id);
            if (purchaseOrder == null)
            {
                return NotFound();
            }

            _context.Purchase_Orders.Remove(purchaseOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PurchaseOrderExists(int id)
        {
            return _context.Purchase_Orders.Any(e => e.Id == id);
        }
    }
}
