using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class UsersService : IUsersService
    {
        IDataProvider _data = null;
        public UsersService(IDataProvider data)
        {
            _data = data;
        }
        public int Add(UserAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[Users_Insert]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection collection)
                {
                    modelCommonParams(model, collection);
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
        public void Update(UserUpdateRequest model)
        {
            string procName = "[dbo].[Users_Update]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", model.Id);
                modelCommonParams(model, collection);
            });
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[Users_Delete]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
             {
                 paramCollection.AddWithValue("@Id", id);
             });
        }
        public User Get(int id)
        {
            string procName = "[dbo].[Users_SelectById]";
            User user = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                user = MapUser(reader);
            });
            return user;
        }
        public List<User> GetTop5()
        {
            List<User> users = null;
            string procName = "[dbo].[Users_SelectTop5]";
            _data.ExecuteCmd(procName, null
                , delegate (IDataReader reader, short set)
            {
                User user = MapUser(reader);
                if (users == null) users = new List<User>();
                users.Add(user);
            });
            return users;
        }
        public List<User> GetAll()
        {
            List<User> users = null;
            string procName = "[dbo].[Users_SelectAll]";
            _data.ExecuteCmd(procName, null, delegate (IDataReader reader, short set)
             {
                 User user = MapUser(reader);
                 if (users == null) users = new List<User>();
                 users.Add(user);
             });
            return users;
        }
        public Paged<User> Paginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Users_SelectPaginated]";
            Paged<User> pagedList = null;
            List<User> users = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                User user = MapUser(reader);
                totalCount = reader.GetSafeInt32(11);
                if (users == null) users = new List<User>();
                users.Add(user);
            });
            if (users != null) pagedList = new Paged<User>(users, pageIndex, pageSize, totalCount);
            return pagedList;
        }
        public Paged<User> Search(int pageIndex, int pageSize, string q)
        {
            string procName = "[dbo].[Users_SearchQuery]";
            Paged<User> pagedList = null;
            List<User> users = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
                paramCollection.AddWithValue("@Query", q);
            }, delegate (IDataReader reader, short set)
            {
                User user = MapUser(reader);
                totalCount = reader.GetSafeInt32(11);
                if (users == null) users = new List<User>();
                users.Add(user);
            });
            if (users != null) pagedList = new Paged<User>(users, pageIndex, pageSize, totalCount);
            return pagedList;
        }
        private static User MapUser(IDataReader reader)
        {
            User user = new User();
            int i = 0;
            user.Id = reader.GetSafeInt32(i++);
            user.Name = reader.GetSafeString(i++);
            user.LastName = reader.GetSafeString(i++);
            user.Email = reader.GetSafeString(i++);
            user.Password = reader.GetSafeString(i++);
            user.PasswordConfirm = reader.GetSafeString(i++);
            user.AvatarUrl = reader.GetSafeString(i++);
            user.TenantId = reader.GetSafeString(i++);
            user.DateModified = reader.GetSafeUtcDateTime(i++);
            user.DateAdded = reader.GetSafeUtcDateTime(i++);
            user.UserId = reader.GetSafeString(i++);
            return user;
        }
        private static void modelCommonParams(UserAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@UserFirstName", model.Name);
            collection.AddWithValue("@UserLastName", model.LastName);
            collection.AddWithValue("@UserEmail", model.Email);
            collection.AddWithValue("@UserPassword", model.Password);
            collection.AddWithValue("@UserPasswordConfirm", model.PasswordConfirm);
            collection.AddWithValue("@UserAvatarUrl", model.AvatarUrl);
            collection.AddWithValue("@UserTenantId", model.TenantId);
            collection.AddWithValue("@UserId", model.UserId);
        }
    }
}
