using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Friends;
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
    [Route("api/friends")]
    [ApiController]
    public class FriendApiController : BaseApiController
    {
        private IFriendsService _service = null;
        public FriendApiController(IFriendsService service, ILogger<FriendApiController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<ItemsResponse<Friend>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Friend> friends = _service.GetAll();
                if (friends == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not found.");
                }
                else
                {
                    response = new ItemsResponse<Friend>() { Items = friends };
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
        public ActionResult<ItemResponse<Friend>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Friend friend = _service.Get(id);
                if (friend == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not found.");
                }
                else
                {
                    response = new ItemResponse<Friend>() { Item = friend };
                }
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"Sql Exception: {sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"Argument Exception: {argEx.Message}");
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
        public ActionResult<ItemResponse<int>> Create(FriendAddRequest model)
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
        public ActionResult<SuccessResponse> Update(FriendUpdateRequest model)
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
        public ActionResult<ItemResponse<Paged<Friend>>> Paginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Friend> paged = _service.Paginated(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("App Resources not found."));
                }
                else
                {
                    ItemResponse<Paged<Friend>> response = new ItemResponse<Paged<Friend>>()
                    { Item = paged };
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
        public ActionResult<ItemResponse<Paged<Friend>>> Search(int pageIndex, int pageSize, string q)
        {
            ActionResult result = null;
            try
            {
                Paged<Friend> paged = _service.Search(pageIndex, pageSize, q);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("App Resources not found."));
                }
                else
                {
                    ItemResponse<Paged<Friend>> response = new ItemResponse<Paged<Friend>>() { Item = paged };
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
