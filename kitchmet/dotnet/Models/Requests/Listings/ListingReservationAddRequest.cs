using Sabio.Models.Domain.Listings;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Listings
{
    public class ListingReservationAddRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int ListingId { get; set; }
        public DateTime DateCheckedIn { get; set; }
        public DateTime DateCheckedOut { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int ChargeId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int StatusId { get; set; }
        [Required]
        [Range(1, 6)]
        public int ListCostTypeId { get; set; }
        [Required]
        public decimal ListCost { get; set; }
        [Required]
        public List<EntityCost> AdditionalServices { get; set; }
    }
}
