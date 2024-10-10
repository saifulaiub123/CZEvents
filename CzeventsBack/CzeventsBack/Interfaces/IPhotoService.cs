using CloudinaryDotNet.Actions;

namespace CzeventsBack.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
    }
}
