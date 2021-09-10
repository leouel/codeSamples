using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Addresses
{
    public class AddressUpdateRequest : AddressAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
