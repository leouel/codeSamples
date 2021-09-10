using System.Collections.Generic;

namespace Sabio.Models
{
    public interface IUserAuthData
    {
        int Id { get; }
        string Email { get; }
        IEnumerable<string> Roles { get; }
        object TenantId { get; }
        string FirstName { get; }
        string LastName { get; }
    }
}