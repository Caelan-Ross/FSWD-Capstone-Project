using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;
using Battery_Doctor.Data;
using Battery_Doctor.DTOs;
using OfficeOpenXml.Style;
using OfficeOpenXml;

namespace Battery_Doctor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public InvoicesController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceR_DTO>>> GetInvoices()
        {
            var invoices =  await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.PaymentMethod)
                .Include(i => i.InvoiceDetails)
                .ToListAsync();

            var invoiceReadDtos = invoices.Select(i => new InvoiceR_DTO
            {
                Id = i.Id,
                CustomerId = i.CustomerId,
                PaymentMethodR = _context.Payment_Methods.FirstOrDefault(x => x.Id == i.PaymentMethodId).Method,
                DateOfSale = i.DateOfSale,
                TotalPrice = i.TotalPrice,
                CashAmount = i.CashAmount,
                DebitAmount = i.DebitAmount,
                CreditAmount = i.CreditAmount,
                CustomerCreditAmount = i.CustomerCreditAmount,
                TaxRate = i.TaxRate,
                Notes = i.Notes,
                AssetIds = i.InvoiceDetails.Select(d => d.AssetId).ToList()
            }).ToList();

            return invoiceReadDtos;

        }

        // GET: api/Invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceR_DTO>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.PaymentMethod)
                .Include(i => i.InvoiceDetails)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            var invoiceReadDto = new InvoiceR_DTO
            {
                Id = invoice.Id,
                CustomerId = invoice.CustomerId,
                PaymentMethodR = _context.Payment_Methods.FirstOrDefault(x => x.Id == invoice.PaymentMethodId).Method,
                DateOfSale = invoice.DateOfSale,
                TotalPrice = invoice.TotalPrice,
                CashAmount = invoice.CashAmount,
                DebitAmount = invoice.DebitAmount,
                CreditAmount = invoice.CreditAmount,
                TaxRate = invoice.TaxRate,
                CustomerCreditAmount = invoice.CustomerCreditAmount,
                Notes = invoice.Notes,
                AssetIds = invoice.InvoiceDetails.Select(d => d.AssetId).ToList()
            };

            return invoiceReadDto;
        }

        // POST: api/Invoices
        [HttpPost]
        public async Task<ActionResult<InvoiceC_DTO>> PostInvoice(InvoiceC_DTO invoiceDto)
        {
            PaymentMethod? paymentMethod = (PaymentMethod?)_context.Payment_Methods.FirstOrDefault(n => n.Method == invoiceDto.PaymentMethodR);

            Customer? customer = (Customer?)_context.Customers.FirstOrDefault(n => n.PhoneNumber == invoiceDto.PhoneNumber && n.Email == invoiceDto.Email);

            if(invoiceDto.AssetIds.Count() == 0)
            {
                return BadRequest();
            }

            if(paymentMethod == null)
            {
                paymentMethod = new PaymentMethod
                {
                    Method = invoiceDto.PaymentMethodR
                };
                _context.Payment_Methods.Add(paymentMethod);
                await _context.SaveChangesAsync();
            }

            if(customer == null)
            {
                customer = new Customer
                {
                    FirstName = invoiceDto.FirstName,
                    LastName = invoiceDto.LastName,
                    PhoneNumber = invoiceDto.PhoneNumber,
                    Email = invoiceDto.Email,
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }

            var invoice = new Invoice
            {
                CustomerId = customer.Id,
                PaymentMethodId = paymentMethod.Id,
                DateOfSale = DateTime.Now,
                TotalPrice = invoiceDto.TotalPrice,
                Notes = invoiceDto.Notes,
                CashAmount = invoiceDto.CashAmount,
                DebitAmount = invoiceDto.DebitAmount,
                CreditAmount = invoiceDto.CreditAmount,
                CustomerCreditAmount = invoiceDto.CustomerCreditAmount,
                TaxRate = invoiceDto.TaxRate,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            invoice.InvoiceDetails = new List<InvoiceDetails>();

            foreach(int id in invoiceDto.AssetIds)
            {
                invoice.InvoiceDetails.Add(new InvoiceDetails
                {
                    AssetId = id,
                    InvoiceId = invoice.Id,
                    UpdatedAt = DateTime.Now,
                    CreatedAt = DateTime.Now
                });
            }

            _context.Entry(invoice).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var invoiceReadDto = new InvoiceR_DTO
            {
                Id = invoice.Id,
                CustomerId = invoice.CustomerId,
                PaymentMethodR = _context.Payment_Methods.FirstOrDefault(x => x.Id == invoice.PaymentMethodId).Method,
                DateOfSale = invoice.DateOfSale,
                TotalPrice = invoice.TotalPrice,
                CashAmount = invoice.CashAmount,
                DebitAmount = invoice.DebitAmount,
                CreditAmount = invoice.CreditAmount,
                CustomerCreditAmount = invoice.CustomerCreditAmount,
                TaxRate = invoice.TaxRate,
                AssetIds = invoice.InvoiceDetails.Select(d => d.AssetId).ToList(),
            };


            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoiceReadDto);
        }

        // PUT: api/Invoices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoice(int id, InvoiceU_DTO invoiceDto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if(invoice == null)
            {
                return NotFound();
            }

            if(invoiceDto.AssetIds.Count() == 0)
            {
                return BadRequest();
            }

            PaymentMethod? paymentMethod = (PaymentMethod?)_context.Payment_Methods.FirstOrDefault(n => n.Method == invoiceDto.PaymentMethodR);

            if(paymentMethod == null)
            {
                paymentMethod = new PaymentMethod
                {
                    Method = invoiceDto.PaymentMethodR
                };
                _context.Payment_Methods.Add(paymentMethod);
                await _context.SaveChangesAsync();
            }

            invoice.UpdatedAt = DateTime.Now;
            invoice.TotalPrice = invoiceDto.TotalPrice;
            invoice.PaymentMethodId = paymentMethod.Id;
            invoice.CustomerId = invoiceDto.CustomerId;
            invoice.CashAmount = invoiceDto.CashAmount;
            invoice.DebitAmount = invoiceDto.DebitAmount;
            invoice.CreditAmount = invoiceDto.CreditAmount;
            invoice.TaxRate = invoiceDto.TaxRate;
            invoice.Notes = invoiceDto.Notes;
            invoice.InvoiceDetails.Clear();

            foreach(int i in invoiceDto.AssetIds)
            {
                invoice.InvoiceDetails.Add(new InvoiceDetails
                {
                    AssetId = i,
                    InvoiceId = invoice.Id,
                    UpdatedAt = DateTime.Now,
                    CreatedAt = DateTime.Now
                });
            }

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceExists(id))
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

        // DELETE: api/Invoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InvoiceExists(int id)
        {
            return _context.Invoices.Any(e => e.Id == id);
        }

        // EXPORT: api/Customers/Export
        [HttpPost("Export")]
        public async Task<IActionResult> Export()
        {
            List<Invoice> invoices = await _context.Invoices.ToListAsync();

            using(var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Invoice Data");

                // Headers
                worksheet.Cells[1, 1].Value = "Invoice ID";
                worksheet.Cells[1, 2].Value = "Customer ID";
                worksheet.Cells[1, 3].Value = "Payment Method";
                worksheet.Cells[1, 4].Value = "Date of Sale";
                worksheet.Cells[1, 5].Value = "Total Price";
                worksheet.Cells[1, 6].Value = "Cash Amount";
                worksheet.Cells[1, 7].Value = "Debit Amount";
                worksheet.Cells[1, 8].Value = "Credit Amount";
                worksheet.Cells[1, 9].Value = "Customer Credit Amount";
                worksheet.Cells[1, 10].Value = "Tax Rate";
                worksheet.Cells[1, 11].Value = "Notes";
                worksheet.Cells[1, 12].Value = "Created At";
                worksheet.Cells[1, 13].Value = "Updated At";

                int rowNumber = 2;

                foreach(var invoice in invoices)
                {
                    worksheet.Cells[rowNumber, 1].Value = invoice.Id;
                    worksheet.Cells[rowNumber, 2].Value = invoice.CustomerId;
                    worksheet.Cells[rowNumber, 3].Value = _context.Payment_Methods.Find(invoice.PaymentMethodId).Method; // Assuming PaymentMethod has a 'Name' property
                    worksheet.Cells[rowNumber, 4].Value = invoice.DateOfSale.ToString("yyyy-MM-dd");
                    worksheet.Cells[rowNumber, 5].Value = invoice.TotalPrice;
                    worksheet.Cells[rowNumber, 6].Value = invoice.CashAmount;
                    worksheet.Cells[rowNumber, 7].Value = invoice.DebitAmount;
                    worksheet.Cells[rowNumber, 8].Value = invoice.CreditAmount;
                    worksheet.Cells[rowNumber, 9].Value = invoice.CustomerCreditAmount;
                    worksheet.Cells[rowNumber, 10].Value = invoice.TaxRate;
                    worksheet.Cells[rowNumber, 11].Value = invoice.Notes;
                    worksheet.Cells[rowNumber, 12].Value = invoice.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    worksheet.Cells[rowNumber, 13].Value = invoice.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    rowNumber++;
                }

                // Auto-Formatting
                using(var range = worksheet.Cells[1, 1, rowNumber - 1, 13])
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

                // Save to desktop with filename "InvoiceData[Current Date].xlsx"
                var desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                var exportDirectoryXl = Path.Combine(desktopPath, "Exports", "Invoice", "Xl");
                var exportDirectoryCsv = Path.Combine(desktopPath, "Exports", "Invoice", "CSV");
                Directory.CreateDirectory(exportDirectoryXl);
                Directory.CreateDirectory(exportDirectoryCsv);
                var now = DateTime.Now;
                var currentDate = now.ToString("yyyyMMdd");
                var filePath = Path.Combine(exportDirectoryXl, $"InvoiceData[{currentDate}]-{now.Ticks.ToString().Substring(now.ToString().Length - 5)}.xlsx");
                var filePathCsv = Path.Combine(exportDirectoryCsv, $"InvoiceData[{currentDate}]-{now.Ticks.ToString().Substring(now.ToString().Length - 5)}.csv");

                package.SaveAs(new FileInfo(filePath));
                package.SaveAs(new FileInfo(filePathCsv));

            }

            return NoContent();
        }
    }
}
