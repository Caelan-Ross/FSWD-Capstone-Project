using Microsoft.EntityFrameworkCore;
using Battery_Doctor.Models;

namespace Battery_Doctor.Data
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<Battery> Batteries { get; set; }
        public DbSet<BatteryCondition> BatteryConditions { get; set; }
        public DbSet<BatteryGroup> BatteryGroups { get; set; }
        public DbSet<BatteryMake> BatteryMakes { get; set; }
        public DbSet<BatteryModel> BatteryModels { get; set; }
        public DbSet<BatteryType> BatteryTypes { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceDetails> InvoiceDetails { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderDetails> PurchaseOrderDetails { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Unit> Units { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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

            modelBuilder.Entity<Customer>()
                .HasOne(c => c.Address)
                .WithMany()
                .HasForeignKey(c => c.AddressId);

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
        }
    }
}
