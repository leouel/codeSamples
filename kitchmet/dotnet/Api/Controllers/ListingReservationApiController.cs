using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Listings;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/listingreservation")]
    [ApiController]
    public class ListingReservationApiController : BaseApiController
    {
        private IListingReservationsService _service = null;
        private IAuthenticationService<int> _authService = null;
        public ListingReservationApiController(IListingReservationsService service, IAuthenticationService<int> authService, ILogger<ListingReservationApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<SuccessResponse> Create(ListingReservationAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Create(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<ListingReservation>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                ListingReservation listingReservation = _service.SelectById(id);
                if (listingReservation == null)
                {
                    code = 404;
                    response = new ErrorResponse("Reservation does not exists.");
                }
                else
                {
                    response = new ItemResponse<ListingReservation> { Item = listingReservation };
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


    }
}
