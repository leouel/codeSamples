using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services.Interfaces
{
    public interface IUsersService
    {
        int Add(UserAddRequest model);
        void Update(UserUpdateRequest model);
        void Delete(int id);
        User Get(int id);
        List<User> GetTop5();
        List<User> GetAll();
        Paged<User> Paginated(int pageIndex, int pageSize);
        Paged<User> Search(int pageIndex, int pageSize, string q);
    }
}
