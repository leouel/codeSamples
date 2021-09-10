using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Jobs;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobApiController : BaseApiController
    {
        private IJobsService _service = null;
        public JobApiController(IJobsService service, ILogger<JobApiController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<ItemsResponse<Job>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Job> jobs = _service.GetAll();
                if (jobs == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not Found.");
                }
                else
                {
                    response = new ItemsResponse<Job>() { Items = jobs };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.Message.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Job>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Job job = _service.Get(id);
                if (job == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not Found.");
                }
                else
                {
                    response = new ItemResponse<Job>() { Item = job };
                }
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse(sqlEx.Message);
                base.Logger.LogError(sqlEx.Message.ToString());
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse(argEx.Message);
                base.Logger.LogError(argEx.Message.ToString());
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.Message.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(JobAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int id = _service.Add(model);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message.ToString());
                result = StatusCode(500, response);
                base.Logger.LogError(ex.ToString());
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(JobUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Job>>> Paginate(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Job> paged = _service.Paginated(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("App Resources not Found."));
                }
                else
                {
                    ItemResponse<Paged<Job>> response = new ItemResponse<Paged<Job>>() { Item = paged };
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
                base.Logger.LogError(ex.ToString());
            }
            return result;
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Job>>> Search(int pageIndex, int pageSize, string q)
        {
            ActionResult result = null;
            try
            {
                Paged<Job> paged = _service.Search(pageIndex, pageSize, q);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("App Resources not Found."));
                }
                else
                {
                    ItemResponse<Paged<Job>> response = new ItemResponse<Paged<Job>>() { Item = paged };
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
                base.Logger.LogError(ex.ToString());
            }
            return result;
        }
    }
}
