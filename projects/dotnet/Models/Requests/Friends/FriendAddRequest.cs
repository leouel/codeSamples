using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Friends
{
    public class FriendAddRequest
    {
        [Required]
        [StringLength(120, MinimumLength =2)]
        public string Title { get; set; }
        [Required]
        [StringLength(700, MinimumLength = 2)]
        public string Bio { get; set; }
        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string Summary { get; set; }
        [Required]
        [StringLength(80, MinimumLength = 2)]
        public string Headline { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Slug { get; set; }
        public string StatusId { get; set; }
        [Required]
        public string ImageTypeId { get; set; }
        public string ImageUrl { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
        public string UserId { get; set; }
        public List<Skill> Skills { get; set; }
    }
}
