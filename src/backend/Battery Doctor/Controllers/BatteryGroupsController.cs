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
    public class BatteryGroupsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public BatteryGroupsController(ApplicationContext context)
        {
            _context = context;
        }

        // Helper method to convert from Model to Dto
        private BatteryGroupDto ToDto(BatteryGroup batteryGroup)
        {
            return new BatteryGroupDto
            {
                Id = batteryGroup.Id,
                GroupName = batteryGroup.GroupName,
                Length = batteryGroup.Length,
                Width = batteryGroup.Width,
                Height = batteryGroup.Height,
                UnitId = batteryGroup.UnitId,
                CreatedAt = batteryGroup.CreatedAt,
                UpdatedAt = batteryGroup.UpdatedAt
            };
        }

        // Helper method to apply Dto fields to Model
        private void ApplyDtoToModel(BatteryGroupDto dto, BatteryGroup model)
        {
            model.GroupName = dto.GroupName;
            model.Length = dto.Length;
            model.Width = dto.Width;
            model.Height = dto.Height;
            model.UnitId = dto.UnitId;
        }

        // GET: api/BatteryGroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BatteryGroupDto>>> GetBatteryGroups()
        {
            var batteryGroups = await _context.BatteryGroups.ToListAsync();
            return batteryGroups.Select(bg => ToDto(bg)).ToList();
        }

        // GET: api/BatteryGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BatteryGroupDto>> GetBatteryGroup(int id)
        {
            var batteryGroup = await _context.BatteryGroups.FindAsync(id);

            if (batteryGroup == null)
            {
                return NotFound();
            }

            return ToDto(batteryGroup);
        }

        // POST: api/BatteryGroups
        [HttpPost]
        public async Task<ActionResult<BatteryGroupDto>> PostBatteryGroup(BatteryGroupDto batteryGroupDto)
        {
            if (!_context.Units.Any(u => u.Id == batteryGroupDto.UnitId))
            {
                return BadRequest("The provided UnitId is invalid.");
            }

            var batteryGroup = new BatteryGroup();
            ApplyDtoToModel(batteryGroupDto, batteryGroup);

            batteryGroup.CreatedAt = DateTime.UtcNow;
            batteryGroup.UpdatedAt = DateTime.UtcNow;
            _context.BatteryGroups.Add(batteryGroup);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBatteryGroup), new { id = batteryGroup.Id }, ToDto(batteryGroup));
        }

        // PUT: api/BatteryGroups/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBatteryGroup(int id, BatteryGroupDto batteryGroupDto)
        {
            if (id != batteryGroupDto.Id)
            {
                return BadRequest();
            }

            if (!_context.Units.Any(u => u.Id == batteryGroupDto.UnitId))
            {
                return BadRequest("The provided UnitId is invalid.");
            }

            var batteryGroup = await _context.BatteryGroups.FindAsync(id);
            if (batteryGroup == null)
            {
                return NotFound();
            }

            ApplyDtoToModel(batteryGroupDto, batteryGroup);
            batteryGroup.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BatteryGroupExists(id))
                {
                    return NotFound();
                }
                else
                {
                    // Consider logging the exception or returning a custom message
                    return StatusCode(500, "An error occurred while updating the data. Please try again.");
                }
            }

            return NoContent();
        }

        // DELETE: api/BatteryGroups/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBatteryGroup(int id)
        {
            var batteryGroup = await _context.BatteryGroups.FindAsync(id);
            if (batteryGroup == null)
            {
                return NotFound();
            }

            _context.BatteryGroups.Remove(batteryGroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BatteryGroupExists(int id)
        {
            return _context.BatteryGroups.Any(e => e.Id == id);
        }
    }
}

