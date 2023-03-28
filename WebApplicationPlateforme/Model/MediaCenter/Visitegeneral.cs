using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.MediaCenter
{
    public class Visitegeneral
    {
        public int Id { get; set; }
        public string organismeNom { get; set; }
        public int organismeId { get; set; }
        public string titre { get; set; }
        public string details { get; set; }
        public string date { get; set; }
        public string dateenreg { get; set; }
        public string userNameCreator { get; set; }

        [ForeignKey("ApplicationUser")]
        public string idUserCreator { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
