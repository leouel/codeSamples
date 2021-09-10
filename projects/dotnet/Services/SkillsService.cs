using Sabio.Data.Providers;
using Sabio.Models.Requests.Skills;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class SkillsService : ISkillsService
    {
        private IDataProvider _data = null;

        public SkillsService(IDataProvider data)
        {
            _data = data;
        }
        public void AddSkills(SkillsAddRequest model)
        {
            string procName = "[dbo].[Skills_Insert]";
            DataTable myParamValue = MapSkillsToTable(model.Skills);

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection sqlParams)
            {
                sqlParams.AddWithValue("@batchSkills", myParamValue);
            });

            //collection.AddWithValue("@batchSkills", myParamValue);
        }

        private DataTable MapSkillsToTable(List<SkillAddRequest> model)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Name", typeof(string));
            foreach (SkillAddRequest skill in model)
            {
                DataRow dr = dt.NewRow();
                int index = 0;
                dr.SetField(index++, skill.Name);
                dt.Rows.Add(dr);
            }
            #region For loop
            /*
                for(int i = 0; i < model.Count; i++)
                {
                    DataRow dr = dt.NewRow();
                    int index = 0;
                    dr.SetField(index++, model[i].Name);
                    dt.Rows.Add(dr);
                }
                */
            #endregion
            return dt;
        }
    }
}
