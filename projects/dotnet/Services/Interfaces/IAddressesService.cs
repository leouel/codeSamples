using Sabio.Models.Domain;
using Sabio.Models.Requests.Addresses;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services
{
    public interface IAddressesService
    {
        int Add(AddressAddRequest model, int userId);
        void Update(AddressUpdateRequest model);
        void Delete(int id);
        Address Get(int id);
        List<Address> GetRandom50();
    }
}
