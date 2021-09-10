using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Requests.Friends
{
    public class FriendUpdateRequest:FriendAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
