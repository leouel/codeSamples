using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Requests.Users;
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
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUserService _service = null;
        private IAuthenticationService<int> _authService = null;
        public UserApiController(IUserService service, IAuthenticationService<int> authService, ILogger<UserApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> Create(UserAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _service.Create(model);
                ItemResponse<int> response = new ItemResponse<int>() { Item = userId };
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

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse>> LogIn(LoginRequestModel reqModel)
        {
            int code = 200;
            BaseResponse response = null;
            bool isSuccessful = false;
            try
            {
                isSuccessful = await _service.LogInAsync(reqModel.Email, reqModel.Password);
                if (!isSuccessful)
                {
                    code = 401;
                    response = new ErrorResponse("Invalid Login Attempt.");
                }
                else
                {
                    response = new SuccessResponse();
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

        [HttpGet("current")]
        public ActionResult<ItemResponse<IUserAuthData>> GetCurrrent()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                IUserAuthData authUser = _authService.GetCurrentUser();
                if (authUser == null)
                {
                    code = 404;
                    response = new ErrorResponse("No currently logged in user.");
                }
                else
                {
                    response = new ItemResponse<IUserAuthData>() { Item = authUser };
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

        [HttpGet("logout")]
        public async Task<ActionResult<SuccessResponse>> Logout()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                await _authService.LogOutAsync();
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
    }
}
