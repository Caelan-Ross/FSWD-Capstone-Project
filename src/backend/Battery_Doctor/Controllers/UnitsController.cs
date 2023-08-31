using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;


namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public UnitsController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Units
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Unit>>> GetUnits()
        {
            return await _context.Units.ToListAsync();
        }

        // GET: api/Units/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Unit>> GetUnit(int id)
        {
            var unit = await _context.Units.FindAsync(id);

            if (unit == null)
            {
                return NotFound();
            }

            return unit;
        }

        // POST: api/Units
        [HttpPost]
        public async Task<ActionResult<Unit>> PostUnit(Unit unit)
        {
            _context.Units.Add(unit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUnit), new { id = unit.Id }, unit);
        }

        // PUT: api/Units/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUnit(int id, Unit unit)
        {
            if (id != unit.Id)
            {
                return BadRequest();
            }

            _context.Entry(unit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UnitExists(id))
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

        // DELETE: api/Units/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null)
            {
                return NotFound();
            }

            _context.Units.Remove(unit);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UnitExists(int id)
        {
            return _context.Units.Any(e => e.Id == id);
        }
    }
}
