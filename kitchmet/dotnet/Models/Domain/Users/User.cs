using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class User : UserBase
    {
        public string Mi { get; set; }
        public LookUp UserStatus { get; set; }
    }
}
