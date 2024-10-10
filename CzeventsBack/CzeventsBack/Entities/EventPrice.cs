namespace CzeventsBack.Entities
{
    public class EventPrice
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public int EventId { get; set; }  // Foreign key
        public Event Event { get; set; }
    }

}
