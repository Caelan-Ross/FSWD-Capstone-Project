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
    public class BatteryMakesController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public BatteryMakesController(ApplicationContext context)
        {
            _context = context;
        }

        // Helper method to convert from Model to Dto
        private BatteryMakeDto ToDto(BatteryMake batteryMake)
        {
            return new BatteryMakeDto
            {
                Id = batteryMake.Id,
                Name = batteryMake.Name,
                CreatedAt = batteryMake.CreatedAt,
                UpdatedAt = batteryMake.UpdatedAt
            };
        }

        // Helper method to apply Dto fields to Model
        private void ApplyDtoToModel(BatteryMakeDto dto, BatteryMake model)
        {
            model.Name = dto.Name;
        }

        // GET: api/BatteryMakes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BatteryMakeDto>>> GetBatteryMakes()
        {
            var batteryMakes = await _context.BatteryMakes.ToListAsync();
            return batteryMakes.Select(bm => ToDto(bm)).ToList();
        }

        // GET: api/BatteryMakes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BatteryMakeDto>> GetBatteryMake(int id)
        {
            var batteryMake = await _context.BatteryMakes.FindAsync(id);

            if (batteryMake == null)
            {
                return NotFound();
            }

            return ToDto(batteryMake);
        }

        // POST: api/BatteryMakes
        [HttpPost]
        public async Task<ActionResult<BatteryMakeDto>> PostBatteryMake(BatteryMakeDto batteryMakeDto)
        {
            var batteryMake = new BatteryMake();
            ApplyDtoToModel(batteryMakeDto, batteryMake);

            batteryMake.CreatedAt = DateTime.UtcNow;
            batteryMake.UpdatedAt = DateTime.UtcNow;
            _context.BatteryMakes.Add(batteryMake);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBatteryMake), new { id = batteryMake.Id }, ToDto(batteryMake));
        }

        // PUT: api/BatteryMakes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBatteryMake(int id, BatteryMakeDto batteryMakeDto)
        {
            if (id != batteryMakeDto.Id)
            {
                return BadRequest();
            }

            var batteryMake = await _context.BatteryMakes.FindAsync(id);
            if (batteryMake == null)
            {
                return NotFound();
            }

            ApplyDtoToModel(batteryMakeDto, batteryMake);
            batteryMake.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BatteryMakeExists(id))
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

        // DELETE: api/BatteryMakes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBatteryMake(int id)
        {
            var batteryMake = await _context.BatteryMakes.FindAsync(id);
            if (batteryMake == null)
            {
                return NotFound();
            }

            _context.BatteryMakes.Remove(batteryMake);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BatteryMakeExists(int id)
        {
            return _context.BatteryMakes.Any(e => e.Id == id);
        }
    }
}
