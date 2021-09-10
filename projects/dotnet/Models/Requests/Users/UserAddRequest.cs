using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Users
{
    public class UserAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string LastName { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Email { get; set; }
        [Required]
        [StringLength(64, MinimumLength = 2)]
        public string Password { get; set; }
        [Required]
        [StringLength(64, MinimumLength = 2)]
        public string PasswordConfirm { get; set; }
        [Required]
        public string AvatarUrl { get; set; }
        public string UserId { get; set; }
        [Required]
        [StringLength(30, MinimumLength = 2)]
        public string TenantId { get; set; }
    }
}
