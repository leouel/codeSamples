using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Friends;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IFriendsService
    {
        int Add(FriendAddRequest model);
        void Delete(int id);
        Friend Get(int id);
        List<Friend> GetAll();
        void Update(FriendUpdateRequest model);
        Paged<Friend> Paginated(int pageIndex, int pageSize);
        Paged<Friend> Search(int pageIndex, int pageSize, string q);
    }
}