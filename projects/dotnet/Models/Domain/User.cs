using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
        public string AvatarUrl { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime DateAdded { get; set; }
        public string UserId { get; set; }
        public string TenantId { get; set; }

        /* from UserBase class: make sure during inheritance, TenantId is handled as and object not a string!
        //public int Id { get; set; }
        //public string Name { get; set; }
        //public IEnumerable<string> Roles { get; set; }
        //public objec TenantId { get; set; }
        */

    }
}
