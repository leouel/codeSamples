using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Requests.Skills
{
    public class SkillUpdateRequest : SkillAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
