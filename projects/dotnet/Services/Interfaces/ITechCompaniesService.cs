using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.TechCompanies;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface ITechCompaniesService
    {
        public int Add(TechCompanyAddRequest model);
        public void Update(TechCompanyUpdateRequest model);
        public List<TechCompany> GetAll();
        public TechCompany Get(int id);
        Paged<TechCompany> Paginate(int pageIndex, int pageSize);
        public Paged<TechCompany> Search(int pageIndex, int pageSize, string q);
    }
}