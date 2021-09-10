using Sabio.Models.Requests.Skills;

namespace Sabio.Services
{
    public interface ISkillsService
    {
        void AddSkills(SkillsAddRequest model);
    }
}