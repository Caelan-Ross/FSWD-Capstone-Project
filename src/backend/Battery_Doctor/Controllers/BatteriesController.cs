using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;
using System.Linq;
using OfficeOpenXml.Style;
using OfficeOpenXml;

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
                .Include(b => b.BatteryCondition)
                .Include(b => b.BatteryGroup.Unit)
                .ToListAsync();

            var batteryReadDtos = batteries.Select(b => new BatteryReadDto
            {
                Id = b.Id,

                TypeName = b.BatteryType.TypeName,
                ModelName = b.BatteryModel.ModelName,
                MakeName = b.BatteryMake.Name,
                ConditionName = b.BatteryCondition.ConditionName,
                Voltage = b.Voltage,
                Capacity = b.Capacity,
                Price = b.Price,
                QuantityOnHand = b.QuantityOnHand,
                GroupName = b.BatteryGroup.GroupName,
                Length = b.BatteryGroup.Length,
                Height = b.BatteryGroup.Height,
                Width = b.BatteryGroup.Width,
                UnitType = b.BatteryGroup.Unit.UnitType,
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
                .Include(b => b.BatteryGroup.Unit)
                .Include(b => b.BatteryCondition)
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
                ConditionName = battery.BatteryCondition.ConditionName,
                Voltage = battery.Voltage,
                Capacity = battery.Capacity,
                Price = battery.Price,
                //QuantityOnHand = battery.QuantityOnHand,
                GroupName = battery.BatteryGroup.GroupName,
                Length = battery.BatteryGroup.Length,
                Height = battery.BatteryGroup.Height,
                Width = battery.BatteryGroup.Width,
                UnitType = battery.BatteryGroup.Unit.UnitType,
                CreatedAt = battery.CreatedAt,
                UpdatedAt = battery.UpdatedAt
            };

            return batteryReadDto;
        }

        // POST: api/Batteries
        [HttpPost]
        public async Task<ActionResult<BatteryReadDto>> PostBattery(BatteryCreateUpdateDto batteryCreateDto)
        {
            BatteryType? type = (BatteryType?)_context.Battery_Types.FirstOrDefault(n => n.TypeName == batteryCreateDto.TypeName);

            BatteryMake? make = (BatteryMake?)_context.Battery_Makes.FirstOrDefault(n => n.Name == batteryCreateDto.MakeName);

            BatteryModel? model = (BatteryModel?)_context.Battery_Models.FirstOrDefault(n => n.ModelName == batteryCreateDto.ModelName);

            BatteryGroup? group = (BatteryGroup?)_context.Battery_Groups.FirstOrDefault(n => n.GroupName == batteryCreateDto.GroupName);

            BatteryCondition? condition = (BatteryCondition?)_context.Battery_Conditions.FirstOrDefault(n => n.ConditionName == batteryCreateDto.ConditionName);
            
            Unit? unit = (Unit?)_context.Units.FirstOrDefault(n => n.UnitType == batteryCreateDto.UnitType);

            if(unit == null)
            {
                unit = new Unit
                {
                    UnitType = batteryCreateDto.UnitType
                };

                _context.Units.Add(unit);
                await _context.SaveChangesAsync();

                group = new BatteryGroup
                {
                    GroupName = batteryCreateDto.GroupName,
                    Length = batteryCreateDto.Length,
                    Width = batteryCreateDto.Width,
                    Height = batteryCreateDto.Height,
                    UnitId = unit.Id,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Battery_Groups.Add(group);
                await _context.SaveChangesAsync();
            }
            else if(group == null)
            {
                group = new BatteryGroup
                {
                    GroupName = batteryCreateDto.GroupName,
                    Length = batteryCreateDto.Length,
                    Width = batteryCreateDto.Width,
                    Height = batteryCreateDto.Height,
                    UnitId = unit.Id,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Battery_Groups.Add(group);
                await _context.SaveChangesAsync();
            }

            if(type == null)
            {
                type = new BatteryType
                {
                    TypeName = batteryCreateDto.TypeName,
                    CreatedAt = DateTime.Now,
                    UpdatedAt= DateTime.Now
                };
                _context.Battery_Types.Add(type);
                await _context.SaveChangesAsync();
            }

            if(make == null)
            {
                make = new BatteryMake
                {
                    Name = batteryCreateDto.MakeName,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Battery_Makes.Add(make);
                await _context.SaveChangesAsync();
            }

            if(model == null)
            {
                model = new BatteryModel
                {
                    ModelName = batteryCreateDto.ModelName,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Battery_Models.Add(model);
                await _context.SaveChangesAsync();
            }

            if(condition == null)
            {
                condition = new BatteryCondition
                {
                    ConditionName = batteryCreateDto.ConditionName,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Battery_Conditions.Add(condition);
                await _context.SaveChangesAsync();
            }

            var battery = new Battery
            {
                TypeId = type.Id,
                ModelId = model.Id,
                MakeId = make.Id,
                ConditionId = condition.Id,
                GroupId = group.Id,
                Voltage = batteryCreateDto.Voltage,
                Capacity = batteryCreateDto.Capacity,
                Price = batteryCreateDto.Price,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Batteries.Add(battery);
            await _context.SaveChangesAsync();

            Asset asset = new Asset
            {
                QRCode = "",
                BatteryId = battery.Id,
                WarrantyDate = DateTime.Now,
                StampedSerial = batteryCreateDto.StampedSerial,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();

            var batteryReadDto = new BatteryReadDto
            {
                Id = battery.Id,
                TypeName = type.TypeName,
                ModelName = model.ModelName,
                MakeName = make.Name,
                Voltage = battery.Voltage,
                Capacity = battery.Capacity,
                Price = battery.Price,
                QuantityOnHand = battery.QuantityOnHand,
                ConditionName = condition.ConditionName,
                GroupName = group.GroupName,
                CreatedAt = battery.CreatedAt,
                UpdatedAt = battery.UpdatedAt
            };
            return CreatedAtAction(nameof(GetBattery), new { id = battery.Id }, batteryReadDto);
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

            BatteryType? type = (BatteryType?)_context.Battery_Types.FirstOrDefault(n => n.TypeName == batteryUpdateDto.TypeName);

            BatteryMake? make = (BatteryMake?)_context.Battery_Makes.FirstOrDefault(n => n.Name == batteryUpdateDto.MakeName);

            BatteryModel? model = (BatteryModel?)_context.Battery_Models.FirstOrDefault(n => n.ModelName == batteryUpdateDto.ModelName);

            BatteryGroup? group = (BatteryGroup?)_context.Battery_Groups.FirstOrDefault(n => n.GroupName == batteryUpdateDto.GroupName);

            BatteryCondition? condition = (BatteryCondition?)_context.Battery_Conditions.FirstOrDefault(n => n.ConditionName == batteryUpdateDto.ConditionName);

            Unit? unit = (Unit?)_context.Units.FirstOrDefault(n => n.UnitType == batteryUpdateDto.UnitType);

            if(unit == null)
            {
                unit = new Unit
                {
                    UnitType = batteryUpdateDto.UnitType
                };

                _context.Units.Add(unit);
                await _context.SaveChangesAsync();

                group = new BatteryGroup
                {
                    GroupName = batteryUpdateDto.GroupName,
                    Length = batteryUpdateDto.Length,
                    Width = batteryUpdateDto.Width,
                    Height = batteryUpdateDto.Height,
                    UnitId = unit.Id,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
            }
            else if(group == null)
            {
                group = new BatteryGroup
                {
                    GroupName = batteryUpdateDto.GroupName,
                    Length = batteryUpdateDto.Length,
                    Width = batteryUpdateDto.Width,
                    Height = batteryUpdateDto.Height,
                    UnitId = unit.Id,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
            }

            if(type == null)
            {
                type = new BatteryType
                {
                    TypeName = batteryUpdateDto.TypeName,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Battery_Types.Add(type);
                await _context.SaveChangesAsync();
            }

            if(make == null)
            {
                make = new BatteryMake
                {
                    Name = batteryUpdateDto.MakeName,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Battery_Makes.Add(make);
                await _context.SaveChangesAsync();
            }

            if(model == null)
            {
                model = new BatteryModel
                {
                    ModelName = batteryUpdateDto.ModelName,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Battery_Models.Add(model);
                await _context.SaveChangesAsync();
            }

            if(condition == null)
            {
                condition = new BatteryCondition
                {
                    ConditionName = batteryUpdateDto.ConditionName,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Battery_Conditions.Add(condition);
                await _context.SaveChangesAsync();
            }

            battery.TypeId = type.Id;
            battery.ModelId = model.Id;
            battery.MakeId = make.Id;
            battery.ConditionId = condition.Id;
            battery.Voltage = batteryUpdateDto.Voltage;
            battery.Capacity = batteryUpdateDto.Capacity;
            battery.Price = batteryUpdateDto.Price;
            battery.GroupId = group.Id;
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

        // EXPORT: api/Customers/Export
        [HttpPost("Export")]
        public async Task<IActionResult> Export()
        {
            List<Battery> batteries = await _context.Batteries.ToListAsync();

            using(var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Battery Data");

                // Headers
                worksheet.Cells[1, 1].Value = "Battery ID";
                worksheet.Cells[1, 2].Value = "Battery Type";
                worksheet.Cells[1, 3].Value = "Battery Model";
                worksheet.Cells[1, 4].Value = "Battery Make";
                worksheet.Cells[1, 5].Value = "Battery Condition";
                worksheet.Cells[1, 6].Value = "Battery Group";
                worksheet.Cells[1, 7].Value = "Voltage";
                worksheet.Cells[1, 8].Value = "Capacity";
                worksheet.Cells[1, 9].Value = "Price";
                worksheet.Cells[1, 10].Value = "Quantity On Hand";
                worksheet.Cells[1, 11].Value = "Created At";
                worksheet.Cells[1, 12].Value = "Updated At";

                int rowNumber = 2;

                foreach(var battery in batteries)
                {
                    worksheet.Cells[rowNumber, 1].Value = battery.Id;
                    worksheet.Cells[rowNumber, 2].Value = _context.Battery_Types.Find(battery.TypeId).TypeName;
                    worksheet.Cells[rowNumber, 3].Value = _context.Battery_Models.Find(battery.ModelId).ModelName;
                    worksheet.Cells[rowNumber, 4].Value = _context.Battery_Makes.Find(battery.MakeId).Name;
                    worksheet.Cells[rowNumber, 5].Value = _context.Battery_Conditions.Find(battery.ConditionId).ConditionName;
                    worksheet.Cells[rowNumber, 6].Value = _context.Battery_Groups.Find(battery.GroupId).GroupName;
                    worksheet.Cells[rowNumber, 7].Value = battery.Voltage;
                    worksheet.Cells[rowNumber, 8].Value = battery.Capacity;
                    worksheet.Cells[rowNumber, 9].Value = battery.Price;
                    worksheet.Cells[rowNumber, 10].Value = battery.QuantityOnHand;
                    worksheet.Cells[rowNumber, 11].Value = battery.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    worksheet.Cells[rowNumber, 12].Value = battery.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    rowNumber++;
                }

                // Auto-Formatting
                using(var range = worksheet.Cells[1, 1, rowNumber - 1, 12])
                {
                    // Setting border for all cells
                    range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    range.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    // Setting font bold for header
                    range[1, 1, 1, 12].Style.Font.Bold = true;

                    // Setting background color for header
                    range[1, 1, 1, 12].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    range[1, 1, 1, 12].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                }

                // AutoFit columns to content size for entire columns
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                // Save to "Exports" subdirectory on the Desktop
                var desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                var exportDirectoryXl = Path.Combine(desktopPath, "Exports", "Batteries", "Xl");
                var exportDirectoryCsv = Path.Combine(desktopPath, "Exports", "Batteries", "CSV");
                Directory.CreateDirectory(exportDirectoryXl);
                Directory.CreateDirectory(exportDirectoryCsv);

                var now = DateTime.Now;
                var currentDate = now.ToString("yyyyMMdd");
                var filePath = Path.Combine(exportDirectoryXl, $"BatteryData[{currentDate}]-{now.Ticks.ToString().Substring(now.ToString().Length - 5)}.xlsx");
                var filePathCsv = Path.Combine(exportDirectoryCsv, $"BatteryData[{currentDate}]-{now.Ticks.ToString().Substring(now.ToString().Length - 5)}.csv");

                package.SaveAs(new FileInfo(filePath));
            }

            return NoContent();
        }
    }
}
