using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Jobs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class JobsService : IJobsService
    {
        private IDataProvider _data = null;
        public JobsService(IDataProvider data)
        {
            _data = data;
        }

        public List<Job> GetAll()
        {
            string procName = "[dbo].[Jobs_SelectAll]";
            List<Job> jobs = null;
            _data.ExecuteCmd(procName, null, delegate (IDataReader reader, short set)
            {
                Job job = MapJob(reader);
                if (jobs == null) jobs = new List<Job>();
                jobs.Add(job);
            });
            return jobs;
        }

        public Job Get(int id)
        {
            string procName = "[dbo].[Jobs_SelectById]";
            Job job = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                job = MapJob(reader);
            });
            return job;
        }

        public int Add(JobAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[Jobs_Insert]";
            DataTable myParamValue = null;
            if (model.Skills != null) myParamValue = MapSkillsToTable(model.Skills);
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                modelCommonParams(model, paramCollection);
                if (model.Skills != null) paramCollection.AddWithValue("@batchSkills", myParamValue);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                paramCollection.Add(idOut);
            }, delegate (SqlParameterCollection returnCollection)
            {
                object objId = returnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out id);
            });
            return id;
        }

        public void Update(JobUpdateRequest model)
        {
            string procName = "[dbo].[Jobs_Update]";
            DataTable myParamValue = null;
            if (model.Skills != null) myParamValue = MapSkillsToTable(model.Skills);
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", model.Id);
                modelCommonParams(model, paramCollection);
                if (model.Skills != null) paramCollection.AddWithValue("@batchSkills", myParamValue);
            });
        }

        public Paged<Job> Paginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Jobs_SelectPaginated]";
            Paged<Job> pagedList = null;
            List<Job> jobs = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                Job job = MapJob(reader);
                totalCount = reader.GetSafeInt32(20);
                if (jobs == null) jobs = new List<Job>();
                jobs.Add(job);
            });
            if (jobs != null) pagedList = new Paged<Job>(jobs, pageIndex, pageSize, totalCount);
            return pagedList;
        }

        public Paged<Job> Search(int pageIndex, int pageSize, string q)
        {
            string procName = "[dbo].[Jobs_SearchQuery]";
            Paged<Job> pagedList = null;
            List<Job> jobs = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
                paramCollection.AddWithValue("@Query", q);
            }, delegate (IDataReader reader, short set)
            {
                Job job = MapJob(reader);
                totalCount = reader.GetSafeInt32(20);
                if (jobs == null) jobs = new List<Job>();
                jobs.Add(job);
            });
            if (jobs != null) pagedList = new Paged<Job>(jobs, pageIndex, pageSize, totalCount);
            return pagedList;
        }

        private static Job MapJob(IDataReader reader)
        {
            Job job = new Job();
            int i = 0;
            job.Id = reader.GetSafeInt32(i++);
            job.Title = reader.GetSafeString(i++);
            job.Description = reader.GetSafeString(i++);
            job.Summary = reader.GetSafeString(i++);
            job.Pay = reader.GetSafeString(i++);
            job.Slug = reader.GetSafeString(i++);
            job.StatusId = reader.GetSafeString(i++);
            job.DateAdded = reader.GetSafeUtcDateTime(i++);
            job.DateModified = reader.GetSafeUtcDateTime(i++);
            job.Skills = reader.DeserializeObject<List<Skill>>(i++);
            job.TechCompany = MapTechCompany(reader);
            return job;
        }
        private static TechCompany MapTechCompany(IDataReader reader)
        {
            TechCompany techCo = new TechCompany();
            int i = 10;
            techCo.Id = reader.GetSafeInt32(i++);
            techCo.Name = reader.GetSafeString(i++);
            techCo.Profile = reader.GetSafeString(i++);
            techCo.Summary = reader.GetSafeString(i++);
            techCo.Headline = reader.GetSafeString(i++);
            techCo.Slug = reader.GetSafeString(i++);
            techCo.StatusId = reader.GetSafeString(i++);
            techCo.DateAdded = reader.GetSafeUtcDateTime(i++);
            techCo.DateModified = reader.GetSafeUtcDateTime(i++);
            techCo.Images = reader.DeserializeObject<List<Image>>(i++);
            return techCo;
        }
        private static void modelCommonParams(JobAddRequest model, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@Title", model.Title);
            paramCollection.AddWithValue("@Description", model.Description);
            paramCollection.AddWithValue("@Summary", model.Summary);
            paramCollection.AddWithValue("@Pay", model.Pay);
            paramCollection.AddWithValue("@Slug", model.Slug);
            paramCollection.AddWithValue("@StatusId", model.StatusId);
            paramCollection.AddWithValue("@TechCompanyId", model.TechCompanyId);
        }
        private static DataTable MapSkillsToTable(List<Skill> model)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Name", typeof(string));
            foreach (Skill skill in model)
            {
                DataRow dr = dt.NewRow();
                int index = 0;
                dr.SetField(index++, skill.Name);
                dt.Rows.Add(dr);
            }
            return dt;
        }
    }
}
