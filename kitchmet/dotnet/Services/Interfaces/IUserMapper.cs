using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IUserMapper
    {
        User MapUser(IDataReader reader, ref int startingIndex);
    }
}
