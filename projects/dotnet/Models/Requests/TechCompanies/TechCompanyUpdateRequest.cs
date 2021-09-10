using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Requests.TechCompanies
{
    public class TechCompanyUpdateRequest : TechCompanyAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
