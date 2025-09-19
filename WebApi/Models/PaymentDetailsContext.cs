using Microsoft.EntityFrameworkCore;

namespace WebApi.Models
{
    public class PaymentDetailsContext : DbContext
    {
        public PaymentDetailsContext(DbContextOptions options) : base(options)
        {
        }

        protected PaymentDetailsContext()
        {
        }
        public DbSet<PaymentDetail> PaymentDetails{ get; set; }
    }
}
