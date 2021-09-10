using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class BaseFriend
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string StatusId { get; set; }
    }
}
