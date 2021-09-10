using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Listings;
using Sabio.Models.Requests.Listings;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class ListingReservationsService : IListingReservationsService
    {
        IDataProvider _data = null;
        public ListingReservationsService(IDataProvider data)
        {
            _data = data;
        }

        public int Create(ListingReservationAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[ListingReservations_Insert]";
            DataTable additionalServices = null;
            if (model.AdditionalServices != null) additionalServices = MapAdditionalServicesToTable(model.AdditionalServices);
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection collection)
            {
                AddCommonParams(model, collection);
                collection.AddWithValue("@UserId", userId);
                if (model.AdditionalServices != null) collection.AddWithValue("@AdditionalServices", additionalServices);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.Add(idOut);
            }, delegate (SqlParameterCollection returnCollection)
            {
                object objId = returnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out id);
            });
            return id;
        }

        public ListingReservation SelectById(int id)
        {
            string procName = "[dbo].[ListingReservations_SelectById]";
            ListingReservation listingReservation = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                listingReservation = MapListingReservation(reader);
            });
            return listingReservation;
        }

        private void AddCommonParams(ListingReservationAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@ListingId", model.ListingId);
            collection.AddWithValue("@DateCheckedIn", model.DateCheckedIn);
            collection.AddWithValue("@DateCheckedOut", model.DateCheckedOut);
            collection.AddWithValue("@ChargeId", model.ChargeId);
            collection.AddWithValue("@StatusId", model.StatusId);
            collection.AddWithValue("@ListingCostTypeId", model.ListCostTypeId);
            collection.AddWithValue("@ListingCost", model.ListCost);
        }
        private DataTable MapAdditionalServicesToTable(List<EntityCost> model)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ServiceTypeId", typeof(int));
            dt.Columns.Add("Cost", typeof(decimal));
            dt.Columns.Add("CostTypeId", typeof(int));
            foreach(EntityCost entity in model)
            {
                DataRow dr = dt.NewRow();
                int index = 0;
                dr.SetField(index++, entity.EntityTypeId);
                dr.SetField(index++, entity.Cost);
                dr.SetField(index++, entity.CostTypeId);
                dt.Rows.Add(dr);
            }
            return dt;
        }
        private ListingReservation MapListingReservation(IDataReader reader)
        {
            int index = 0;
            ListingReservation listingReservation = new ListingReservation();
            listingReservation.Id = reader.GetSafeInt32(index++);
            listingReservation.Listings = MapListingWizard(reader, ref index);
            listingReservation.DateCheckedIn = reader.GetSafeDateTime(index++);
            listingReservation.DateCheckedOut = reader.GetSafeDateTime(index++);
            listingReservation.ChargeId = reader.GetSafeString(index++);
            listingReservation.StatusId = reader.GetSafeInt32(index++);
            listingReservation.StatusName = reader.GetSafeString(index++);
            listingReservation.UserId = reader.GetSafeInt32(index++);
            listingReservation.ListCostTypeId = reader.GetSafeInt32(index++);
            listingReservation.ListCost = reader.GetSafeDecimal(index++);
            listingReservation.AdditionalServices = reader.DeserializeObject<List<EntityCost>>(index++);
            listingReservation.DateCreated = reader.GetSafeUtcDateTime(index++);
            listingReservation.DateModifed = reader.GetSafeUtcDateTime(index++);
            return listingReservation;
        }

        private ListingDetails MapListingWizard(IDataReader reader, ref int startingIndex)
        {
            ListingDetails listingWizard = new ListingDetails();

            listingWizard.Id = reader.GetSafeInt32(startingIndex++);
            listingWizard.Name = reader.GetString(startingIndex++);
            listingWizard.Title = reader.GetSafeString(startingIndex++);
            listingWizard.ShortDescription = reader.GetSafeString(startingIndex++);
            listingWizard.Description = reader.GetString(startingIndex++);
            listingWizard.CheckInTime = reader.GetSafeDateTime(startingIndex++);
            listingWizard.CheckOutTime = reader.GetSafeDateTime(startingIndex++);
            listingWizard.DaysAvailable = reader.GetSafeInt32(startingIndex++);
            listingWizard.HasReservation = reader.GetBoolean(startingIndex++);
            listingWizard.IsActive = reader.GetBoolean(startingIndex++);
            listingWizard.CreatedBy = reader.GetSafeInt32(startingIndex++);
            listingWizard.DateCreated = reader.GetSafeDateTime(startingIndex++);
            listingWizard.DateModifed = reader.GetSafeDateTime(startingIndex++);

            return listingWizard;
        }
    }
}
