using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;

namespace Battery_Doctor.Data
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext()
        {

        }

        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {

        }

        public DbSet<Address> Addresses { get; set; }

        public DbSet<Asset> Assets { get; set; }

        public DbSet<Battery> Batteries { get; set; }

        public DbSet<BatteryCondition> Battery_Conditions { get; set; }

        public DbSet<BatteryGroup> Battery_Groups { get; set; }

        public DbSet<BatteryMake> Battery_Makes { get; set; }

        public DbSet<BatteryModel> Battery_Models { get; set; }

        public DbSet<BatteryType> Battery_Types { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Invoice> Invoices { get; set; }

        public DbSet<InvoiceDetails> Invoice_Details { get; set; }

        public DbSet<PaymentMethod> Payment_Methods { get; set; }

        public DbSet<PurchaseOrder> Purchase_Orders { get; set; }

        public DbSet<PurchaseOrderDetails> Purchase_Order_Details { get; set; }

        public DbSet<Supplier> Suppliers { get; set; }

        public DbSet<Unit> Units { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // If context is not already configured;
            if(!optionsBuilder.IsConfigured)
            {
                // Specify the connection to the database
                optionsBuilder.UseMySql("server=localhost;port=3306;user=root;database=fullstack_capstone ", new MySqlServerVersion(new Version(10, 10, 3)));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
