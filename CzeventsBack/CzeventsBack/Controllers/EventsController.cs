using CzeventsBack.Context;
using CzeventsBack.DTO_S;
using CzeventsBack.Entities;
using CzeventsBack.Interfaces;
using CzeventsBack.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;

namespace CzeventsBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly IPhotoService _photoService;
        private readonly ITokenService _tokenService;
        public EventsController(DataContext dataContext, IPhotoService photoService, ITokenService tokenService)
        {
            _dataContext = dataContext;
            _photoService = photoService;
            _tokenService = tokenService;
        }


        [HttpPost("AddEvent")]
        public async Task<ActionResult<Event>> AddEvent([FromForm] EventDto eventdto)
        {
            if (eventdto == null || eventdto.Photo == null)
            {
                return BadRequest("EventDto or its fields are null.");
            }

            var resultP = await _photoService.AddPhotoAsync(eventdto.Photo);
            if (resultP == null || resultP.SecureUrl == null || resultP.SecureUrl.AbsoluteUri == null)
            {
                return BadRequest("Unable to retrieve secure photo URL.");
            }

            var photo = resultP.SecureUrl.AbsoluteUri;

            // Deserialize PriceRange from JSON string, handle null or empty PriceRange
            var priceRanges = eventdto.PriceRange != null ?
                JsonConvert.DeserializeObject<List<EventPrice>>(Request.Form["PriceRange"]) :
                new List<EventPrice>(); // Initialize empty list if no price ranges are provided

            var newevent = new Event
            {
                Name = eventdto.Name,
                Location = eventdto.Location,
                Date = eventdto.Date,
                PriceRange = priceRanges,
                Type = eventdto.Type,
                Description = eventdto.Description,
                OrganizerEmail = eventdto.OrganizerEmail,
                OrganizerName = eventdto.OrganizerName,
                OrganizerNumber = eventdto.OrganizerNumber,
                Link = eventdto.Link,
                Photo = photo,
            };

            try
            {
                await _dataContext.Events.AddAsync(newevent);
                await _dataContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }

            return new Event { /* return the created event properties */ };
        }



        [HttpPost("UpdateEvent/{eventId}")]
        public async Task<ActionResult<Event>> UpdateEvent(int eventId, [FromForm] EventDto eventdto)
        {
            if (eventdto == null)
            {
                return BadRequest("EventDto object is null.");
            }

            var existingEvent = await _dataContext.Events.FindAsync(eventId);
            if (existingEvent == null)
            {
                return NotFound("Event not found.");
            }   
           

            // Update existing event properties with new values
            existingEvent.Name = eventdto.Name;
            existingEvent.Location = eventdto.Location;
            existingEvent.Date = eventdto.Date;
            existingEvent.PriceRange = eventdto.PriceRange;
            existingEvent.Type = eventdto.Type;
            existingEvent.Description = eventdto.Description;
            existingEvent.OrganizerEmail = eventdto.OrganizerEmail;
            existingEvent.OrganizerName = eventdto.OrganizerName;
            existingEvent.OrganizerNumber = eventdto.OrganizerNumber;
            existingEvent.Link = eventdto.Link;
            if (eventdto.Photo != null)
            {
                var resultP = await _photoService.AddPhotoAsync(eventdto.Photo);
                if (resultP == null || resultP.SecureUrl == null || resultP.SecureUrl.AbsoluteUri == null)
                {
                    return BadRequest("Unable to retrieve secure photo URL.");
                }
                existingEvent.Photo = resultP.SecureUrl.AbsoluteUri;
            }

            // Save changes to the database
            await _dataContext.SaveChangesAsync();

            return existingEvent;
        }

        [HttpDelete("DeleteEvent/{eventId}")]
        public async Task<IActionResult> DeleteEvent(int eventId)
        {
            // Retrieve event from database
            var existingEvent = await _dataContext.Events
                .Include(e => e.PriceRange)  // Include related EventPrices
                .SingleOrDefaultAsync(e => e.Id == eventId);

            if (existingEvent == null)
            {
                return NotFound("Event not found.");
            }

            // Delete related EventPrices
            var eventPrices = _dataContext.EventPrices.Where(ep => ep.EventId == eventId);
            _dataContext.EventPrices.RemoveRange(eventPrices);

            // Delete event from database
            _dataContext.Events.Remove(existingEvent);
            await _dataContext.SaveChangesAsync();

            return Ok(); // Or any appropriate response
        }


        [HttpGet("GetAllEvents")]
        public IActionResult GetEvents()
        {
            // Use Include to load related data (EventPrice) with the Event entity
            var events = _dataContext.Events
                .Include(e => e.PriceRange)  // Explicitly include the PriceRange collection
                .ToList();

            return Ok(events);
        }


        [HttpGet("GetSpecialEvent/{id}")]
        public IActionResult GetSpecialEvent(int id)
        {
            var specialEvent = _dataContext.Events
                .Include(e => e.PriceRange) // Include PriceRange to load the related prices
                .SingleOrDefault(e => e.Id == id);

            if (specialEvent == null)
            {
                return NotFound(); // Return 404 if event not found
            }

            return Ok(specialEvent); // Return the event with its PriceRange
        }


        [HttpGet("GetEventByType/{type}")]
        public IActionResult GetSpecialEvent(string type)
        {
            var sevent = _dataContext.Events.Where(x => x.Type == type).Include(e => e.PriceRange).ToList();
            return Ok(sevent);
        }

        [HttpPost("LoginAdmin")]
        public async Task<ActionResult<LogResponse>> Register([FromForm] AdminDto logindto)
        {
            var user = await _dataContext.Admins.SingleOrDefaultAsync(x => x.Email == logindto.Email);
            if(user == null)
            {
                return NotFound("User not found");
            }
            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(logindto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Password is incorrect");
                }
            }
            var token = _tokenService.CreateTokenAdmin(user);
            return new LogResponse { token = token };
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAdmin(AdminDto adminRegistrationDto)
        {
            // Check if the email already exists
            if (await _dataContext.Admins.AnyAsync(a => a.Email == adminRegistrationDto.Email.ToLower()))
            {
                return BadRequest("Email is already in use.");
            }

            // Create the password hash and salt
            CreatePasswordHash(adminRegistrationDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // Create a new Admin entity
            var admin = new Admin
            {
                Email = adminRegistrationDto.Email.ToLower(),
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            // Add the admin to the database
            _dataContext.Admins.Add(admin);
            await _dataContext.SaveChangesAsync();

            return Ok("Admin registered successfully.");
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        [HttpPost("AddSlide")]
        public async Task<ActionResult<Slides>> AddSlide([FromForm] SlidesDto slides)
        {
            if (slides == null)
            {
                return BadRequest("Event is null.");
            }

            // Check if eventdto.Photo is null
            if (slides.Slide == null)
            {
                return BadRequest("Photo is null.");
            }

            var resultP = await _photoService.AddPhotoAsync(slides.Slide);
            if (resultP == null || resultP.SecureUrl == null || resultP.SecureUrl.AbsoluteUri == null)
            {
                return BadRequest("Unable to retrieve secure photo URL.");
            }

            var photo = resultP.SecureUrl.AbsoluteUri;

            var newslide = new Slides
            {
                Slide = photo,
                Link = slides.Link
            };

            await _dataContext.Slides.AddAsync(newslide);
            await _dataContext.SaveChangesAsync();

            return new Slides { Slide = photo, Link = slides.Link };

        }

        [HttpGet("GetSlides")]
        public IActionResult GetSlides()
        {
            var slides = _dataContext.Slides.ToList();
            return Ok(slides);
        }

        [HttpDelete("DeleteSlide/{slideId}")]
        public async Task<IActionResult> DeleteSlide(int slideId)
        {
            try
            {
                var slide = await _dataContext.Slides.FirstOrDefaultAsync(x => x.Id == slideId);

                if (slide == null)
                {
                    return NotFound("NOT FOUND");
                }

                _dataContext.Slides.Remove(slide);
                await _dataContext.SaveChangesAsync();

                return Ok("Slide deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
