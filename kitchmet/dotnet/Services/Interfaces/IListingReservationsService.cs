using Sabio.Models.Domain;
using Sabio.Models.Requests.Listings;

namespace Sabio.Services
{
    public interface IListingReservationsService
    {
        int Create(ListingReservationAddRequest model, int userId);
        ListingReservation SelectById(int id);
    }
}