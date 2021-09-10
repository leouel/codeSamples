using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Friend : BaseFriend
    {
        public string Bio { get; set; }
        public string Summary { get; set; }
        public string Headline { get; set; }
        public Image PrimaryImage { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
        public string UserId { get; set; }
        public List<Skill> Skills { get; set; }
    }
}
