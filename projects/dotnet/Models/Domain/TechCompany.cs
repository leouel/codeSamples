using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class TechCompany
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Profile { get; set; }
        public string Summary { get; set; }
        public string Headline { get; set; }
        public string ContactInformation { get; set; }
        public string Slug { get; set; }
        public string StatusId { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
        public List<Image> Images { get; set; }
    }
}
