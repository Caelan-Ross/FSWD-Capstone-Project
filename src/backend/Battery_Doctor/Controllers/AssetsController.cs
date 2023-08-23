using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssetsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public AssetsController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Assets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssetR_DTO>>> GetAssets()
        {
            List<Asset> assets = _context.Assets
                .Include(a => a.Battery)
                .Include(a => a.Customer)
                .Include(a => a.Battery.BatteryGroup)
                .ToList();
            List<AssetR_DTO> assetR_DTOs = assets.Select(a => new AssetR_DTO
            {
                Id = a.Id,
                QRCode = a.QRCode,
                BatteryName = a.Battery.BatteryGroup.GroupName,
                StampedSerial = a.StampedSerial,
                CustomerFL = (a.Customer.FirstName + " " + a.Customer.LastName),
                WarrantyDate = a.WarrantyDate

            }).ToList();

            return assetR_DTOs;
        }

        // GET: api/Assets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssetR_DTO>> GetAsset(int id)
        {
            var asset = await _context.Assets
                .Include(a => a.Battery)
                .Include(a => a.Customer)
                .Include(a => a.Battery.BatteryGroup)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (asset == null)
            {
                return NotFound();
            }

            var assetR_DTO = new AssetR_DTO
            {
                QRCode = asset.QRCode,
                BatteryName = asset.Battery.BatteryGroup.GroupName,
                StampedSerial = asset.StampedSerial,
                CustomerFL = (asset.Customer.FirstName + " " + asset.Customer.LastName),
                WarrantyDate = asset.WarrantyDate
            };

            return assetR_DTO;
        }

        // POST: api/Assets
        [HttpPost]
        public async Task<ActionResult<Asset>> PostAsset(AssetC_DTO createAssetDto)
        {
            if (!_context.Batteries.Any(b => b.Id == createAssetDto.BatteryId) ||
                (createAssetDto.CustomerId.ToString() != "" && !_context.Customers.Any(c => c.Id == createAssetDto.CustomerId)))
            {
                return BadRequest("The provided BatteryId or CustomerId is invalid.");
            }

            Asset asset = new Asset
            {
                BatteryId = createAssetDto.BatteryId,
                CustomerId = createAssetDto.CustomerId,
                WarrantyDate = DateTime.Now,
                StampedSerial = createAssetDto.StampedSerial,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };

            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAsset), new { id = asset.Id }, asset);
        }

        // PUT: api/Assets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsset(int id, Asset asset)
        {
            if (id != asset.Id)
            {
                return BadRequest();
            }

            if (!_context.Batteries.Any(b => b.Id == asset.BatteryId) ||
                (asset.CustomerId.ToString() != "" && !_context.Customers.Any(c => c.Id == asset.CustomerId)))
            {
                return BadRequest("The provided BatteryId or CustomerId is invalid.");
            }

            asset.UpdatedAt = DateTime.UtcNow;
            _context.Entry(asset).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssetExists(id))
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

        // DELETE: api/Assets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
            {
                return NotFound();
            }

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssetExists(int id)
        {
            return _context.Assets.Any(e => e.Id == id);
        }
    }
}

