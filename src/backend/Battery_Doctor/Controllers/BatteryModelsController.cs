using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BatteryModelsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public BatteryModelsController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/BatteryModels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BatteryModelDto>>> GetBatteryModels()
        {
            var batteryModels = await _context.Battery_Models.ToListAsync();
            var batteryModelDtos = batteryModels.Select(bm => new BatteryModelDto
            {
                Id = bm.Id,
                ModelName = bm.ModelName,
                CreatedAt = bm.CreatedAt,
                UpdatedAt = bm.UpdatedAt,
                BatteryMakeId = bm.BatteryMakeId
            }).ToList();

            return batteryModelDtos;
        }

        // GET: api/BatteryModels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BatteryModelDto>> GetBatteryModel(int id)
        {
            var batteryModel = await _context.Battery_Models.FindAsync(id);

            if (batteryModel == null)
            {
                return NotFound();
            }

            var batteryModelDto = new BatteryModelDto
            {
                Id = batteryModel.Id,
                ModelName = batteryModel.ModelName,
                CreatedAt = batteryModel.CreatedAt,
                UpdatedAt = batteryModel.UpdatedAt,
                BatteryMakeId = batteryModel.BatteryMakeId
            };

            return batteryModelDto;
        }

        // POST: api/BatteryModels
        [HttpPost]
        public async Task<ActionResult<BatteryModelDto>> PostBatteryModel(BatteryModelDto batteryModelDto)
        {
            if (!_context.Battery_Makes.Any(b => b.Id == batteryModelDto.BatteryMakeId))
            {
                return BadRequest("The provided BatteryMakeId is invalid.");
            }

            var batteryModel = new BatteryModel
            {
                ModelName = batteryModelDto.ModelName,
                BatteryMakeId = batteryModelDto.BatteryMakeId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            _context.Battery_Models.Add(batteryModel);
            await _context.SaveChangesAsync();

            // Update DTO with ID assigned by database
            batteryModelDto.Id = batteryModel.Id;

            return CreatedAtAction(nameof(GetBatteryModel), new { id = batteryModel.Id }, batteryModelDto);
        }

        // PUT: api/BatteryModels/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBatteryModel(int id, BatteryModelDto batteryModelDto)
        {
            if (id != batteryModelDto.Id)
            {
                return BadRequest();
            }

            if (!_context.Battery_Makes.Any(b => b.Id == batteryModelDto.BatteryMakeId))
            {
                return BadRequest("The provided BatteryMakeId is invalid.");
            }

            var batteryModel = new BatteryModel
            {
                Id = batteryModelDto.Id,
                ModelName = batteryModelDto.ModelName,
                BatteryMakeId = batteryModelDto.BatteryMakeId,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = batteryModelDto.CreatedAt // Preserving the original CreatedAt value
            };

            _context.Entry(batteryModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BatteryModelExists(id))
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

        // DELETE: api/BatteryModels/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBatteryModel(int id)
        {
            var batteryModel = await _context.Battery_Models.FindAsync(id);
            if (batteryModel == null)
            {
                return NotFound();
            }

            _context.Battery_Models.Remove(batteryModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BatteryModelExists(int id)
        {
            return _context.Battery_Models.Any(e => e.Id == id);
        }
    }
}
