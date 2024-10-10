using CzeventsBack.Context;
using CzeventsBack.DTO_S;
using CzeventsBack.Entities;
using CzeventsBack.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace CzeventsBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly DataContext _dataContext;
        private readonly IPhotoService _photoService;
        private readonly ITokenService _tokenService;
        public UserController(DataContext dataContext, IPhotoService photoService, ITokenService tokenService)
        {
            _dataContext = dataContext;
            _photoService = photoService;
            _tokenService = tokenService;
        }

        [HttpPost("Register-User")]
        public async Task<ActionResult<UserDto>> Register([FromBody] UserRegistrationDto userDto)
        {
            // Validate the mobile number format
            if (!Regex.IsMatch(userDto.MobileNumber, @"^[0-9]{9,12}$")) // Example for validating 9-12 digit numbers
            {
                return BadRequest("Invalid mobile number format.");
            }

            var existingUser = await _dataContext.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                return BadRequest("Email already registered.");
            }

            using var hmac = new HMACSHA512();

            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                MobileNumber = userDto.MobileNumber, // This will now correctly be handled as a string
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.Password)),
                PasswordSalt = hmac.Key,
            };

            var token = _tokenService.CreateToken(user);

            _dataContext.Users.Add(user);
            await _dataContext.SaveChangesAsync();

            return new UserDto { Email = userDto.Email, Token = token };

        }

        [Authorize]
        [HttpGet("GetUserData")]
        public async Task<ActionResult<User>> GetUserData()
        {
            // Use ClaimTypes.NameIdentifier to match JwtRegisteredClaimNames.NameId
            var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User email claim not found");
            }

            var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.Email == userEmail);

            if (user == null) return NotFound("User not found.");
            // Return user details
            return new User { Email = user.Email, Username = user.Username };
        }


        [HttpPost("Login-User")]
        public async Task<ActionResult<UserDto>> Login([FromBody] UserLoginDto userDto)
        {
            var user = await _dataContext.Users.SingleOrDefaultAsync(x => x.Email == userDto.Email);
            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Password is incorrect");
                }
            }
            var token = _tokenService.CreateToken(user);

            return new UserDto { Email = userDto.Email, Token = token };
        }

    }
}
