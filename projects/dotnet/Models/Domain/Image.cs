using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Image
    {
        public int Id { get; set; }
        public string ImageTypeId { get; set; }
        public string ImageUrl { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
    }
}
