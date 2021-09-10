using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.TechCompanies;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/techcompanies")]
    [ApiController]
    public class TechCompanyApiController : BaseApiController
    {
        private ITechCompaniesService _service = null;
        public TechCompanyApiController(ITechCompaniesService service, ILogger<TechCompanyApiController> logger) : base(logger)
        {
            _service = service;
        }
        
        [HttpGet]
        public ActionResult<ItemsResponse<TechCompany>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<TechCompany> companies = _service.GetAll();
                if(companies == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not Found.");
                }
                else
                {
                    response = new ItemsResponse<TechCompany>() { Items = companies };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<TechCompany>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                TechCompany company = _service.Get(id);
                if(company == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not Found.");
                }
                else
                {
                    response = new ItemResponse<TechCompany>() { Item = company };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(TechCompanyAddRequest model)
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
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
                base.Logger.LogError(ex.ToString());
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(TechCompanyUpdateRequest model)
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
        public ActionResult<ItemResponse<Paged<TechCompany>>> Paginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<TechCompany> paged = _service.Paginate(pageIndex, pageSize);
                if(paged == null)
                {
                    result = NotFound404(new ErrorResponse("App Resources not Found"));
                }
                else
                {
                    ItemResponse<Paged<TechCompany>> response = new ItemResponse<Paged<TechCompany>>() { Item = paged };
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
        public ActionResult<ItemResponse<Paged<TechCompany>>> Search(int pageIndex, int pageSize, string q)
        {
            ActionResult result = null;
            try
            {
                Paged<TechCompany> paged = _service.Search(pageIndex, pageSize, q);
                if(paged == null)
                {
                    result = NotFound404(new ErrorResponse("App Resources not Found."));
                }
                else
                {
                    ItemResponse<Paged<TechCompany>> response = new ItemResponse<Paged<TechCompany>>() { Item = paged };
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
