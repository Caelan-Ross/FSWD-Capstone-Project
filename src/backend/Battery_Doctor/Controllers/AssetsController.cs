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
                .Include(b => b.Battery.BatteryType)
                .Include(b => b.Battery.BatteryModel)
                .Include(b => b.Battery.BatteryMake)
                .Include(b => b.Battery.BatteryGroup)
                .Include(b => b.Battery.BatteryGroup.Unit)
                .Include(b => b.Battery.BatteryCondition)
                .ToList();
            List<AssetR_DTO> assetR_DTOs = assets.Select(a => new AssetR_DTO
            {
                Id = a.Id,
                QRCode = a.QRCode,
                StampedSerial = a.StampedSerial,
                WarrantyDate = a.WarrantyDate,
                BatteryId = a.Battery.Id,
                TypeName = a.Battery.BatteryType.TypeName,
                ModelName = a.Battery.BatteryModel.ModelName,
                MakeName = a.Battery.BatteryMake.Name,
                ConditionName = a.Battery.BatteryCondition.ConditionName,
                Voltage = a.Battery.Voltage,
                Capacity = a.Battery.Capacity,
                Price = a.Battery.Price,
                GroupName = a.Battery.BatteryGroup.GroupName,
                Length = a.Battery.BatteryGroup.Length,
                Height = a.Battery.BatteryGroup.Height,
                Width = a.Battery.BatteryGroup.Width,
                UnitType = a.Battery.BatteryGroup.Unit.UnitType,

            }).ToList();

            return assetR_DTOs;
        }

        // GET: api/Assets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssetR_DTO>> GetAsset(int id)
        {
            var asset = await _context.Assets
                .Include(b => b.Battery.BatteryType)
                .Include(b => b.Battery.BatteryModel)
                .Include(b => b.Battery.BatteryMake)
                .Include(b => b.Battery.BatteryGroup)
                .Include(b => b.Battery.BatteryGroup.Unit)
                .Include(b => b.Battery.BatteryCondition)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (asset == null)
            {
                return NotFound();
            }

            var assetR_DTO = new AssetR_DTO
            {
                Id = asset.Id,
                QRCode = asset.QRCode,
                StampedSerial = asset.StampedSerial,
                WarrantyDate = asset.WarrantyDate,
                BatteryId = asset.Battery.Id,
                TypeName = asset.Battery.BatteryType.TypeName,
                ModelName = asset.Battery.BatteryModel.ModelName,
                MakeName = asset.Battery.BatteryMake.Name,
                ConditionName = asset.Battery.BatteryCondition.ConditionName,
                Voltage = asset.Battery.Voltage,
                Capacity = asset.Battery.Capacity,
                Price = asset.Battery.Price,
                GroupName = asset.Battery.BatteryGroup.GroupName,
                Length = asset.Battery.BatteryGroup.Length,
                Height = asset.Battery.BatteryGroup.Height,
                Width = asset.Battery.BatteryGroup.Width,
                UnitType = asset.Battery.BatteryGroup.Unit.UnitType,
            };

            return assetR_DTO;
        }

        // POST: api/Assets
        [HttpPost]
        public async Task<ActionResult<Asset>> PostAsset(AssetC_DTO createAssetDto)
        {
            if (!_context.Batteries.Any(b => b.Id == createAssetDto.BatteryId))
            {
                return BadRequest("The provided BatteryId or CustomerId is invalid.");
            }

            Asset asset = new Asset
            {
                BatteryId = createAssetDto.BatteryId,
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

            if (!_context.Batteries.Any(b => b.Id == asset.BatteryId))
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

