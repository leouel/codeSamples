using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserService : IUserService, IUserMapper
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;
        public UserService(IAuthenticationService<int> authService, IDataProvider dataProvider)
        {
            _authenticationService = authService;
            _dataProvider = dataProvider;
        }
        public async Task<bool> LogInAsync(string email, string password)
        {
            bool isSuccessful = false;
            IUserAuthData response = Get(email, password);
            if (response != null)
            {
                await _authenticationService.LogInAsync(response);
                isSuccessful = true;
            }
            return isSuccessful;
        }
        public async Task<bool> LogInTest(string email, string password, int id, string[] roles = null)
        {
            bool isSuccessful = false;
            var testRoles = new[] { "User", "Super", "Content Manager" };

            var allRoles = roles == null ? testRoles : testRoles.Concat(roles);

            IUserAuthData response = new UserBase
            {
                Id = id
                ,
                Email = email
                ,
                Roles = allRoles
                ,
                TenantId = "Acme Corp UId"
                ,
                FirstName = "Sabio"
                ,
                LastName = "Fellow"
            };

            Claim fullName = new Claim("CustomClaim", "Sabio Bootcamp");
            await _authenticationService.LogInAsync(response, new Claim[] { fullName });

            return isSuccessful;
        }
        public int Create(UserAddRequest model)
        {
            int userId = 0;
            string password = model.Password;
            string salt = BCrypt.BCryptHelper.GenerateSalt(12);
            string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);
            string procName = "[dbo].[Users_Insert]";
            _dataProvider.ExecuteNonQuery(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Email", model.Email);
                collection.AddWithValue("@Password", hashedPassword);
                collection.AddWithValue("@FirstName", model.FirstName);
                collection.AddWithValue("@LastName", model.LastName);
                collection.AddWithValue("@Mi", model.Mi);
                collection.AddWithValue("@UserRole", model.Role);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.Add(idOut);
            }, delegate (SqlParameterCollection returnCollection)
            {
                object objId = returnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out userId);
            });
            return userId;
        }

        /// <summary>
        /// Gets the Data call to get a give user
        /// </summary>
        /// <param name="email"></param>
        /// <param name="passwordHash"></param>
        /// <returns></returns>

        //public async Task<bool> LogIn(string email, string password)
        //{
        //    bool isSuccessful = false;
        //    User user = Get(email, password);

        //    if (user != null )
        //    {
        //            await _authenticationService.LogInAsync(user);
        //            isSuccessful = true;
        //    }
        //    return isSuccessful;
        //}

        private User Get(string email, string password)
        {
            string procName = "[dbo].[Users_SelectAuthDataByEmail]";
            User user = null;
            string passwordFromDB = null;
            bool isValidCredentials = false;
            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Email", email);
            }, delegate (IDataReader reader, short set)
            {
                User anAuthUser = MapAuthUser(reader);
                passwordFromDB = reader.GetSafeString(reader.FieldCount - 1);
                isValidCredentials = BCrypt.BCryptHelper.CheckPassword(password, passwordFromDB);
                if (isValidCredentials)
                {
                    user = anAuthUser;
                }
            });
            return user;
        }

        private User MapAuthUser(IDataReader reader)
        {
            
            int index = 0;
            User user = MapUser(reader, ref index);
            user.UserStatus = new LookUp();
            List<LookUp> roles = reader.DeserializeObject<List<LookUp>>(index++);
            if (roles != null && roles.Count > 0)
            {
                user.Roles = roles.Select(r => r.Name).ToList();
            }
            user.UserStatus.Id = reader.GetSafeInt32(index++);
            user.UserStatus.Name = reader.GetSafeString(index++);
            user.TenantId = $"KitchmetId_{user.Id}"; // TenantId needed for claims
            return user;
        }

        public User MapUser(IDataReader reader, ref int startingIndex)
        {
            User user = new User();
            user.Id = reader.GetSafeInt32(startingIndex++);
            user.FirstName = reader.GetSafeString(startingIndex++);
            user.LastName = reader.GetSafeString(startingIndex++);
            user.Mi = reader.GetSafeString(startingIndex++);
            user.Email = reader.GetSafeString(startingIndex++);

            return user;
        }

    }
}