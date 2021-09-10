using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Requests.Skills
{
    public class SkillAddRequest
    {
        public string Name { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
    }
}
