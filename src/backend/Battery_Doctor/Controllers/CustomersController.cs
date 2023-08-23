using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public CustomersController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerReadDto>>> GetAllCustomers()
        {
            var customers = await _context.Customers.Include(c => c.Address).ToListAsync();

            var customerDtos = customers.Select(c => new CustomerReadDto
            {
                Id = c.Id,
                PhoneNumber = c.PhoneNumber,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email
            }).ToList();

            return customerDtos;
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerReadDto>> GetCustomer(int id)
        {
            var customer = await _context.Customers.Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound();
            }

            var customerDto = new CustomerReadDto
            {
                Id = customer.Id,
                PhoneNumber = customer.PhoneNumber,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email
            };

            return customerDto;
        }

        // POST: api/Customers
        [HttpPost]
        public async Task<ActionResult<CustomerReadDto>> CreateCustomer(CustomerCreateDto customerDto)
        {
            var customer = new Customer
            {
                PhoneNumber = customerDto.PhoneNumber,
                FirstName = customerDto.FirstName,
                LastName = customerDto.LastName,
                Email = customerDto.Email,
                Address = null,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var readDto = new CustomerCreateDto
            {
                Id = customer.Id,
                PhoneNumber = customer.PhoneNumber,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
            };

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, readDto);
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(CustomerCreateDto customerDto)
        {
            var customer = await _context.Customers.Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.Id == customerDto.Id);

            if (customer == null)
            {
                return NotFound();
            }

            customer.FirstName = customerDto.FirstName;
            customer.LastName = customerDto.LastName;
            customer.Email = customerDto.Email;
            customer.PhoneNumber = customerDto.PhoneNumber;

            customer.Address = null;

            customer.UpdatedAt = DateTime.Now;
            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(customerDto.Id))
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

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }

        // EXPORT: api/Customers/Export
        [HttpPost("Export")]
        public async Task<IActionResult> Export()
        {
            List<Customer> customers = await _context.Customers.ToListAsync();

            using(var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Customer Data");

                // Headers
                worksheet.Cells[1, 1].Value = "ID";
                worksheet.Cells[1, 2].Value = "Phone Number";
                worksheet.Cells[1, 3].Value = "First Name";
                worksheet.Cells[1, 4].Value = "Last Name";
                worksheet.Cells[1, 5].Value = "Email";
                worksheet.Cells[1, 6].Value = "Created At";
                worksheet.Cells[1, 7].Value = "Updated At";

                int rowNumber = 2;

                foreach(var customer in customers)
                {
                    worksheet.Cells[rowNumber, 1].Value = customer.Id;
                    worksheet.Cells[rowNumber, 2].Value = customer.PhoneNumber;
                    worksheet.Cells[rowNumber, 3].Value = customer.FirstName;
                    worksheet.Cells[rowNumber, 4].Value = customer.LastName;
                    worksheet.Cells[rowNumber, 5].Value = customer.Email;
                    worksheet.Cells[rowNumber, 6].Value = customer.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    worksheet.Cells[rowNumber, 7].Value = customer.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    rowNumber++;
                }

                // Auto-Formatting
                using(var range = worksheet.Cells[1, 1, rowNumber - 1, 7])
                {
                    // Setting border for all cells
                    range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    range.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    // Setting font bold for header
                    range[1, 1, 1, 7].Style.Font.Bold = true;

                    // Setting background color for header
                    range[1, 1, 1, 7].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    range[1, 1, 1, 7].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                }

                // AutoFit columns to content size for entire columns
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                // Save to desktop with filename "CustomerData[Current Date].xlsx"
                var desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                var exportDirectory = Path.Combine(desktopPath, "Exports", "Customer");
                Directory.CreateDirectory(exportDirectory);

                var now = DateTime.Now;
                var currentDate = now.ToString("yyyyMMdd");
                var filePath = Path.Combine(exportDirectory, $"CustomerData[{currentDate}]-{now.Ticks.ToString().Substring(now.ToString().Length - 5)}.xlsx");
                var filePathCsv = Path.Combine(exportDirectory, $"CustomerData[{currentDate}]-{now.Ticks.ToString().Substring(now.ToString().Length - 5)}.csv");

                package.SaveAs(new FileInfo(filePath));
                package.SaveAs(new FileInfo(filePathCsv));

            }

            return NoContent();
        }
    }
}