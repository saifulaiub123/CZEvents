using CzeventsBack.Entities;

namespace CzeventsBack.Interfaces
{
    public interface ITokenService
    {
        string CreateTokenAdmin(Admin token);
        string CreateToken(User token);
    }
}
