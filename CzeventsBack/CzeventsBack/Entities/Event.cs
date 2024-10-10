namespace CzeventsBack.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Date { get; set; }
        public List<EventPrice> PriceRange { get; set; } = new List<EventPrice>();
        public string Type { get; set; }
        public string City { get; set; }
        public string Description { get; set; }
        public string OrganizerName { get; set; }
        public string OrganizerEmail { get; set; }
        public string OrganizerNumber { get; set; }
        public string Link { get; set; }
        public string Photo { get; set; }
    }
}
