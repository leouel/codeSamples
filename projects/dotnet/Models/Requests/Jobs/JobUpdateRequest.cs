using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Requests.Jobs
{
    public class JobUpdateRequest : JobAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
