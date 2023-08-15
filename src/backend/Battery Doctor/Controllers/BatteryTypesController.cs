using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;


namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BatteryTypesController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public BatteryTypesController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/BatteryTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BatteryType>>> GetBatteryTypes()
        {
            return await _context.Battery_Types.ToListAsync();
        }

        // GET: api/BatteryTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BatteryType>> GetBatteryType(int id)
        {
            var batteryType = await _context.Battery_Types.FindAsync(id);

            if (batteryType == null)
            {
                return NotFound();
            }

            return batteryType;
        }

        // POST: api/BatteryTypes
        [HttpPost]
        public async Task<ActionResult<BatteryType>> PostBatteryType(BatteryType batteryType)
        {
            batteryType.CreatedAt = DateTime.UtcNow;
            batteryType.UpdatedAt = DateTime.UtcNow;
            _context.Battery_Types.Add(batteryType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBatteryType), new { id = batteryType.Id }, batteryType);
        }

        // PUT: api/BatteryTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBatteryType(int id, BatteryType batteryType)
        {
            if (id != batteryType.Id)
            {
                return BadRequest();
            }

            batteryType.UpdatedAt = DateTime.UtcNow;
            _context.Entry(batteryType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BatteryTypeExists(id))
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

        // DELETE: api/BatteryTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBatteryType(int id)
        {
            var batteryType = await _context.Battery_Types.FindAsync(id);
            if (batteryType == null)
            {
                return NotFound();
            }

            _context.Battery_Types.Remove(batteryType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BatteryTypeExists(int id)
        {
            return _context.Battery_Types.Any(e => e.Id == id);
        }
    }
}
