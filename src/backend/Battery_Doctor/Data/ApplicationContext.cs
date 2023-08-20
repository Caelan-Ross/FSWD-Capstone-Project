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

            /*
            modelBuilder.Entity<Battery>()
                .HasOne(b => b.BatteryType)
                .WithMany()
                .HasForeignKey(b => b.TypeId);

            modelBuilder.Entity<Battery>()
                .HasOne(b => b.BatteryModel)
                .WithMany()
                .HasForeignKey(b => b.ModelId);

            modelBuilder.Entity<Battery>()
                .HasOne(b => b.BatteryMake)
                .WithMany()
                .HasForeignKey(b => b.MakeId);

            modelBuilder.Entity<Battery>()
                .HasOne(b => b.BatteryGroup)
                .WithMany()
                .HasForeignKey(b => b.GroupId);

            modelBuilder.Entity<Asset>()
                .HasOne(a => a.Battery)
                .WithMany()
                .HasForeignKey(a => a.BatteryId);

            modelBuilder.Entity<Asset>()
                .HasOne(a => a.Customer)
                .WithMany()
                .HasForeignKey(a => a.CustomerId);

            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Customer)
                .WithMany()
                .HasForeignKey(i => i.CustomerId);

            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.PaymentMethod)
                .WithMany()
                .HasForeignKey(i => i.PaymentMethodId);

            modelBuilder.Entity<InvoiceDetails>()
                .HasOne(id => id.Invoice)
                .WithMany()
                .HasForeignKey(id => id.InvoiceId);

            modelBuilder.Entity<InvoiceDetails>()
                .HasOne(id => id.Asset)
                .WithMany()
                .HasForeignKey(id => id.AssetId);

            modelBuilder.Entity<BatteryGroup>()
                .HasOne(bg => bg.Unit)
                .WithMany()
                .HasForeignKey(bg => bg.UnitId);

            modelBuilder.Entity<BatteryModel>()
                .HasOne(bm => bm.BatteryMake)
                .WithMany(bm => bm.BatteryModels)
                .HasForeignKey(bm => bm.BatteryMakeId);

            modelBuilder.Entity<PurchaseOrder>()
                .HasOne(po => po.Supplier)
                .WithMany()
                .HasForeignKey(po => po.SupplierId);

            modelBuilder.Entity<PurchaseOrderDetails>()
                .HasOne(pod => pod.PurchaseOrder)
                .WithMany(pod => pod.PurchaseOrderDetails)
                .HasForeignKey(pod => pod.PurchaseOrderId);

            modelBuilder.Entity<PurchaseOrderDetails>()
                .HasOne(pod => pod.Battery)
                .WithMany()
                .HasForeignKey(pod => pod.BatteryId);

            modelBuilder.Entity<Supplier>()
                .HasOne(s => s.Address)
                .WithMany()
                .HasForeignKey(s => s.AddressId);
            */
        }
    }
}
