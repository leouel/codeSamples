using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Jobs;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IJobsService
    { 
        List<Job> GetAll();
        Job Get(int id);
        public int Add(JobAddRequest model);
        public void Update(JobUpdateRequest model);
        Paged<Job> Paginated(int pageIndex, int pageSize);
        Paged<Job> Search(int pageIndex, int pageSize, string q);
    }
}