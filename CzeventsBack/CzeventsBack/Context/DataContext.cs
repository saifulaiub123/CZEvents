using CzeventsBack.Entities;
using Microsoft.EntityFrameworkCore;

namespace CzeventsBack.Context
{
    public class DataContext : DbContext
    {
        public DbSet<Event> Events { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Slides> Slides { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<EventPrice> EventPrices { get; set; }

        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>()
                .HasMany(e => e.PriceRange)
                .WithOne(ep => ep.Event)
                .HasForeignKey(ep => ep.EventId);

            modelBuilder.Entity<EventPrice>()
                .Property(ep => ep.Price)
                .HasColumnType("decimal(18,2)");  // Configures precision and scale for the Price field

            base.OnModelCreating(modelBuilder);
        }
    }
}
