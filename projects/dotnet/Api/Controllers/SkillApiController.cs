using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Requests.Skills;
using Sabio.Services;
using Sabio.Web.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/skills")]
    [ApiController]
    public class SkillApiController : BaseApiController
    {
        private ISkillsService _service = null;

        public SkillApiController(ISkillsService service, ILogger<SkillApiController> logger) : base(logger)
        {
            _service = service;
        }

        //[HttpPost]
        //public ActionResult Create(SkillAddRequest model)
        //{
            
        //}
    }
}
