using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.DepartEmployee
{
    public class Depart
    {
        public int Id { get; set; }
        public string employeeNom { get; set; }
        public string employeeId { get; set; }
        public string employeeNum { get; set; }
        public string dateDepart { get; set; }
        public string raisonDepart { get; set; }
        public string dateEnreg { get; set; }

        public string userNameCreator { get; set; }

        [ForeignKey("ApplicationUser")]
        public string idUserCreator { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
