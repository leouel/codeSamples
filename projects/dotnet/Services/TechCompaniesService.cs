using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.TechCompanies;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class TechCompaniesService : ITechCompaniesService
    {
        private IDataProvider _data = null;
        public TechCompaniesService(IDataProvider data)
        {
            _data = data;
        }
        public int Add(TechCompanyAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[TechCompanies_Insert]";
            DataTable myParamValue = null;
            if (model.Images != null) myParamValue = MapImagesToTable(model.Images);
            _data.ExecuteNonQuery(procName, delegate(SqlParameterCollection paramCollection) 
            {
                modelCommonParams(model, paramCollection);
                if (model.Images != null) paramCollection.AddWithValue("@Images", myParamValue);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                paramCollection.Add(idOut);
            }, delegate(SqlParameterCollection returnCollection) 
            {
                object objId = returnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out id);
            });
            return id;
        }
        public void Update(TechCompanyUpdateRequest model)
        {
            string procName = "[dbo].[TechCompanies_Update]";
            DataTable myParamValue = null;
            if (model.Images != null) myParamValue = MapImagesToTable(model.Images);
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", model.Id);
                modelCommonParams(model, paramCollection);
                if (model.Images != null) paramCollection.AddWithValue("@Images", myParamValue);
            });
        }
        public List<TechCompany> GetAll()
        {
            string procName = "[dbo].[TechCompanies_SelectAll]";
            List<TechCompany> companies = null;
            _data.ExecuteCmd(procName, null, delegate (IDataReader reader, short set)
            {
                TechCompany company = MapCompany(reader);
                if (companies == null) companies = new List<TechCompany>();
                companies.Add(company);
            });
            return companies;
        }

        public TechCompany Get(int id)
        {
            string procName = "[dbo].[TechCompanies_SelectById]";
            TechCompany company = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                company = MapCompany(reader);
            });
            return company;
        }

        public Paged<TechCompany> Paginate(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[TechCompanies_SelectPaginated]";
            Paged<TechCompany> pagedList = null;
            List<TechCompany> companies = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                TechCompany company = MapCompany(reader);
                totalCount = reader.GetSafeInt32(11);
                if (companies == null) companies = new List<TechCompany>();
                companies.Add(company);
            });
            if (companies != null) pagedList = new Paged<TechCompany>(companies, pageIndex, pageSize, totalCount);

            return pagedList;
        }

        public Paged<TechCompany> Search(int pageIndex, int pageSize, string q)
        {
            string procName = "[dbo].[TechCompanies_SearchQuery]";
            Paged<TechCompany> pagedList = null;
            List<TechCompany> companies = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
                paramCollection.AddWithValue("@Query", q);
            }, delegate (IDataReader reader, short set)
            {
                TechCompany company = MapCompany(reader);
                totalCount = reader.GetSafeInt32(11);
                if (companies == null) companies = new List<TechCompany>();
                companies.Add(company);
            });
            if (companies != null) pagedList = new Paged<TechCompany>(companies, pageIndex, pageSize, totalCount);
            return pagedList;
        }

        private static void modelCommonParams(TechCompanyAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@Name", model.Name);
            collection.AddWithValue("@Profile", model.Profile);
            collection.AddWithValue("@Summary", model.Summary);
            collection.AddWithValue("@Headline", model.Headline);
            collection.AddWithValue("@ContactInformation", model.ContactInformation);
            collection.AddWithValue("@Slug", model.Slug);
            collection.AddWithValue("@StatusId", model.StatusId);
        }

        private static TechCompany MapCompany(IDataReader reader)
        {
            TechCompany company = new TechCompany();
            int i = 0;
            company.Id = reader.GetSafeInt32(i++);
            company.Name = reader.GetSafeString(i++);
            company.Profile = reader.GetSafeString(i++);
            company.Summary = reader.GetSafeString(i++);
            company.Headline = reader.GetSafeString(i++);
            company.ContactInformation = reader.GetSafeString(i++);
            company.Slug = reader.GetSafeString(i++);
            company.StatusId = reader.GetSafeString(i++);
            company.DateAdded = reader.GetSafeUtcDateTime(i++);
            company.DateModified = reader.GetSafeUtcDateTime(i++);
            company.Images = reader.DeserializeObject<List<Image>>(i++);
            return company;
        }

        private static DataTable MapImagesToTable(List<Image> model)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("imageTypeId", typeof(string));
            dt.Columns.Add("imageUrl", typeof(string));
            foreach(Image image in model)
            {
                DataRow dr = dt.NewRow();
                int index = 0;
                dr.SetField(index++, image.ImageTypeId);
                dr.SetField(index++, image.ImageUrl);
                dt.Rows.Add(dr);
            }
            return dt;
        }
    }
}
