using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Requests.Users
{
    public class UserUpdateRequest : UserAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
