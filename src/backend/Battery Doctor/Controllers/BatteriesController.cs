using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;
using System.Linq;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BatteriesController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public BatteriesController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Batteries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BatteryReadDto>>> GetBatteries()
        {
            var batteries = await _context.Batteries
                .Include(b => b.BatteryType)
                .Include(b => b.BatteryModel)
                .Include(b => b.BatteryMake)
                .Include(b => b.BatteryGroup)
                .ToListAsync();

            var batteryReadDtos = batteries.Select(b => new BatteryReadDto
            {
                Id = b.Id,
                TypeName = b.BatteryType.TypeName,
                ModelName = b.BatteryModel.ModelName,
                MakeName = b.BatteryMake.Name,
                Voltage = b.Voltage,
                Capacity = b.Capacity,
                Price = b.Price,
                QuantityOnHand = b.QuantityOnHand,
                GroupName = b.BatteryGroup.GroupName,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt
            }).ToList();

            return batteryReadDtos;
        }

        // GET: api/Batteries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BatteryReadDto>> GetBattery(int id)
        {
            var battery = await _context.Batteries
                .Include(b => b.BatteryType)
                .Include(b => b.BatteryModel)
                .Include(b => b.BatteryMake)
                .Include(b => b.BatteryGroup)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (battery == null)
            {
                return NotFound();
            }

            var batteryReadDto = new BatteryReadDto
            {
                Id = battery.Id,
                TypeName = battery.BatteryType.TypeName,
                ModelName = battery.BatteryModel.ModelName,
                MakeName = battery.BatteryMake.Name,
                Voltage = battery.Voltage,
                Capacity = battery.Capacity,
                Price = battery.Price,
                QuantityOnHand = battery.QuantityOnHand,
                GroupName = battery.BatteryGroup.GroupName,
                CreatedAt = battery.CreatedAt,
                UpdatedAt = battery.UpdatedAt
            };

            return batteryReadDto;
        }

        // POST: api/Batteries
        [HttpPost]
        public async Task<ActionResult<BatteryReadDto>> PostBattery(BatteryCreateUpdateDto batteryCreateDto)
        {
            // Validate the associated Ids
            if (!_context.Battery_Types.Any(e => e.Id == batteryCreateDto.TypeId) ||
                !_context.Battery_Models.Any(e => e.Id == batteryCreateDto.ModelId) ||
                !_context.Battery_Makes.Any(e => e.Id == batteryCreateDto.MakeId) ||
                !_context.Battery_Groups.Any(e => e.Id == batteryCreateDto.GroupId))
            {
                return BadRequest("One or more associated Ids are invalid.");
            }

            var battery = new Battery
            {
                TypeId = batteryCreateDto.TypeId,
                ModelId = batteryCreateDto.ModelId,
                MakeId = batteryCreateDto.MakeId,
                Voltage = batteryCreateDto.Voltage,
                Capacity = batteryCreateDto.Capacity,
                Price = batteryCreateDto.Price,
                QuantityOnHand = batteryCreateDto.QuantityOnHand,
                GroupId = batteryCreateDto.GroupId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Batteries.Add(battery);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBattery), new { id = battery.Id }, battery);
        }

        // PUT: api/Batteries/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBattery(int id, BatteryCreateUpdateDto batteryUpdateDto)
        {
            var battery = await _context.Batteries.FindAsync(id);
            if (battery == null)
            {
                return NotFound();
            }

            // Validate the associated Ids
            if (!_context.Battery_Types.Any(e => e.Id == batteryUpdateDto.TypeId) ||
                !_context.Battery_Models.Any(e => e.Id == batteryUpdateDto.ModelId) ||
                !_context.Battery_Makes.Any(e => e.Id == batteryUpdateDto.MakeId) ||
                !_context.Battery_Groups.Any(e => e.Id == batteryUpdateDto.GroupId))
            {
                return BadRequest("One or more associated Ids are invalid.");
            }

            battery.TypeId = batteryUpdateDto.TypeId;
            battery.ModelId = batteryUpdateDto.ModelId;
            battery.MakeId = batteryUpdateDto.MakeId;
            battery.Voltage = batteryUpdateDto.Voltage;
            battery.Capacity = batteryUpdateDto.Capacity;
            battery.Price = batteryUpdateDto.Price;
            battery.QuantityOnHand = batteryUpdateDto.QuantityOnHand;
            battery.GroupId = batteryUpdateDto.GroupId;
            battery.UpdatedAt = DateTime.UtcNow;

            _context.Entry(battery).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BatteryExists(id))
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

        // DELETE: api/Batteries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBattery(int id)
        {
            var battery = await _context.Batteries.FindAsync(id);
            if (battery == null)
            {
                return NotFound();
            }

            _context.Batteries.Remove(battery);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BatteryExists(int id)
        {
            return _context.Batteries.Any(e => e.Id == id);
        }
    }
}
