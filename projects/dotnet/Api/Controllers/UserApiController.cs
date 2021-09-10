using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUsersService _service = null;

        public UserApiController(IUsersService service, ILogger<UserApiController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<ItemsResponse<User>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<User> users = _service.GetAll();
                if (users == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource is not found.");
                }
                else
                {
                    response = new ItemsResponse<User>() { Items = users };
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
        public ActionResult<ItemResponse<User>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                User user = _service.Get(id);

                if (user == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource is not found.");
                }
                else
                {
                    response = new ItemResponse<User>() { Item = user };
                }
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"Sql Error: {sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"Argument Error: {argEx.Message}");
                base.Logger.LogError(argEx.ToString());
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
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

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(UserAddRequest model)
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
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(UserUpdateRequest model)
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
        public ActionResult<ItemResponse<Paged<User>>> Paginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<User> paged = _service.Paginated(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("App Resources not found."));
                }
                else
                {
                    ItemResponse<Paged<User>> response = new ItemResponse<Paged<User>>() { Item = paged };
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
        public ActionResult<ItemResponse<Paged<User>>> Search(int pageIndex, int pageSize, string q)
        {
            ActionResult result = null;
            try
            {
                Paged<User> paged = _service.Search(pageIndex, pageSize, q);
                if(paged == null)
                {
                    result = NotFound404(new ErrorResponse("App Resources not found."));
                }
                else
                {
                    ItemResponse<Paged<User>> response = new ItemResponse<Paged<User>>() { Item = paged };
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
