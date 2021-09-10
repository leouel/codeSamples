using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Friends;
using Sabio.Models.Requests.Skills;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class FriendsService : IFriendsService
    {
        IDataProvider _data = null;
        public FriendsService(IDataProvider data)
        {
            _data = data;
        }
        public int Add(FriendAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[Friends_InsertV3]";
            DataTable myParamValue = null;
            if (model.Skills != null) myParamValue = MapSkillsToTable(model.Skills);
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection collection)
            {
                modelCommonParams(model, collection);
                if (model.Skills != null) collection.AddWithValue("@batchSkills", myParamValue);
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
        public void Update(FriendUpdateRequest model)
        {
            string procName = "[dbo].[Friends_UpdateV2]";
            DataTable myParamValue = null;
            if (model.Skills != null) myParamValue = MapSkillsToTable(model.Skills);
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", model.Id);
                modelCommonParams(model, collection);
                if(model.Skills != null) collection.AddWithValue("@batchSkills", myParamValue);
            });
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[Friends_Delete]";
            _data.ExecuteNonQuery(procName
                , delegate (SqlParameterCollection paramCollection)
             {
                 paramCollection.AddWithValue("@Id", id);
             });
        }
        public Friend Get(int id)
        {
            Friend friend = null;
            string procName = "[dbo].[Friends_SelectById]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
             {
                 paramCollection.AddWithValue("@Id", id);
             }, delegate (IDataReader reader, short set)
             {
                 friend = MapFriend(reader);
             });
            return friend;
        }
        public List<Friend> GetAll()
        {
            List<Friend> friends = null;
            string procName = "[dbo].[Friends_SelectAllV2]";
            _data.ExecuteCmd(procName, null
                , delegate (IDataReader reader, short set)
            {
                Friend friend = MapFriend(reader);
                if (friends == null) friends = new List<Friend>();
                friends.Add(friend);
            });
            return friends;
        }
        public Paged<Friend> Paginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Friends_SelectPaginated]";
            Paged<Friend> pagedList = null;
            List<Friend> friends = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                Friend friend = MapFriend(reader);
                totalCount = reader.GetSafeInt32(14);
                if (friends == null) friends = new List<Friend>();
                friends.Add(friend);
            });
            if (friends != null) pagedList = new Paged<Friend>(friends, pageIndex, pageSize, totalCount);
            return pagedList;
        }
        public Paged<Friend> Search(int pageIndex, int pageSize, string q)
        {
            string procName = "[dbo].[Friends_SearchQuery]";
            Paged<Friend> pagedList = null;
            List<Friend> friends = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
                paramCollection.AddWithValue("@Query", q);
            }, delegate (IDataReader reader, short set)
            {
                Friend friend = MapFriend(reader);
                totalCount = reader.GetSafeInt32(14);
                if (friends == null) friends = new List<Friend>();
                friends.Add(friend);
            });
            if (friends != null) pagedList = new Paged<Friend>(friends, pageIndex, pageSize, totalCount);
            return pagedList;
        }
        private static Friend MapFriend(IDataReader reader)
        {
            Friend friend = new Friend();
            int i = 0;
            friend.Id = reader.GetSafeInt32(i++);
            friend.Title = reader.GetSafeString(i++);
            friend.Bio = reader.GetSafeString(i++);
            friend.Summary = reader.GetSafeString(i++);
            friend.Headline = reader.GetSafeString(i++);
            friend.Slug = reader.GetSafeString(i++);
            friend.StatusId = reader.GetSafeString(i++);
            friend.DateAdded = reader.GetSafeUtcDateTime(i++);
            friend.DateModified = reader.GetSafeUtcDateTime(i++);
            friend.UserId = reader.GetSafeString(i++);
            friend.Skills = reader.DeserializeObject<List<Skill>>(i++);
            friend.PrimaryImage = MapImage(reader);
            return friend;
        }
        private static Image MapImage(IDataReader reader)
        {
            Image image = new Image();
            int i = 11;
            image.Id = reader.GetSafeInt32(i++);
            image.ImageTypeId = reader.GetSafeString(i++);
            image.ImageUrl = reader.GetSafeString(i++);
            return image;
        }
        private static void modelCommonParams(FriendAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@FriendTitle", model.Title);
            collection.AddWithValue("@FriendBio", model.Bio);
            collection.AddWithValue("@FriendSummary", model.Summary);
            collection.AddWithValue("@FriendHeadline", model.Headline);
            collection.AddWithValue("@FriendSlug", model.Slug);
            collection.AddWithValue("@FriendStatusId", model.StatusId);
            collection.AddWithValue("@FriendImageTypeId", model.ImageTypeId);
            collection.AddWithValue("@FriendImageUrl", model.ImageUrl);
            collection.AddWithValue("@FriendUserId", model.UserId);
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
