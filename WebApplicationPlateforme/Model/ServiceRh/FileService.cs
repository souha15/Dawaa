using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationPlateforme.Model.ServiceRh
{
    public class FileService
    {
        public int Id { get; set; }
        public string path { get; set; }
        public int serviceId{ get; set; }
        public string serviceName { get; set; }
    }
}
