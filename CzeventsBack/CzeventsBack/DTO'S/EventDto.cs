using CzeventsBack.Entities;

namespace CzeventsBack.DTO_S
{
    public class EventDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string Date { get; set; }
        public List<EventPrice> PriceRange { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string OrganizerName { get; set; }
        public string OrganizerEmail { get; set; }
        public string OrganizerNumber { get; set; }
        public string Link { get; set; }
        public string Country { get; set; }
        public IFormFile Photo { get; set; }
    }
}
