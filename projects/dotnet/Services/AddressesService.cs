using System;
using System.Collections.Generic;
using System.Text;
using Sabio.Models.Domain;
using Sabio.Data.Providers;
using System.Data.SqlClient;
using System.Data;
using Sabio.Data;
using Sabio.Models.Requests.Addresses;

namespace Sabio.Services
{
    // returning data from the database
    public class AddressesService : IAddressesService
    {
        IDataProvider _data = null;
        public AddressesService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(AddressAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Sabio_Addresses_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    modelCommonParams(model, collection);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    collection.Add(idOut);

                }, returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object objId = returnCollection["@Id"].Value;
                    int.TryParse(objId.ToString(), out id);
                });

            return id;
        }

        public void Update(AddressUpdateRequest model)
        {
            string procName = "[dbo].[Sabio_Addresses_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", model.Id);
                modelCommonParams(model, collection);
            });
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Sabio_Addresses_DeleteById]";
            _data.ExecuteNonQuery(procName, inputParamMapper:delegate(SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            });
        }

        public Address Get(int id)
        {
            string procName = "[dbo].[Sabio_Addresses_SelectById]";
            Address address = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {   // takes one shape and produces a second shape
                // int => param(int)
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {   // single Record Mapper
                // takes one shape => secondShape
                // reader from DB(tabular data) => Address
                address = MapAddress(reader);
            }
            );
            return address;
        }

        public List<Address> GetRandom50()
        {
            string procName = "[dbo].[Sabio_Addresses_SelectRandom50]";
            List<Address> addresses = null;
            Address address = null;

            _data.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
             {
                 address = MapAddress(reader);
                 if (addresses == null) addresses = new List<Address>();
                 addresses.Add(address);
             });
            return addresses;
        }

        private static Address MapAddress(IDataReader reader)
        {
            Address address = new Address();
            int i = 0;
            address.Id = reader.GetSafeInt32(i++);
            address.LineOne = reader.GetSafeString(i++);
            address.SuiteNumber = reader.GetSafeInt32(i++);
            address.City = reader.GetSafeString(i++);
            address.State = reader.GetSafeString(i++);
            address.PostalCode = reader.GetSafeString(i++);
            address.IsActive = reader.GetSafeBool(i++);
            address.Lat = reader.GetSafeDouble(i++);
            address.Long = reader.GetSafeDouble(i++);
            return address;
        }
        private static void modelCommonParams(AddressAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@LineOne", model.LineOne);
            collection.AddWithValue("@SuiteNumber", model.SuiteNumber);
            collection.AddWithValue("@City", model.City);
            collection.AddWithValue("@State", model.State);
            collection.AddWithValue("@PostalCode", model.PostalCode);
            collection.AddWithValue("@IsActive", model.IsActive);
            collection.AddWithValue("@Lat", model.Lat);
            collection.AddWithValue("@Long", model.Long);
        }

    }
}
