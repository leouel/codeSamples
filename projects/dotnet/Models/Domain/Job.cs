using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Summary { get; set; }
        public string Pay { get; set; }
        public string Slug { get; set; }
        public string StatusId { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
        public List<Skill> Skills { get; set; }
        public TechCompany TechCompany { get; set; }
    }
}
