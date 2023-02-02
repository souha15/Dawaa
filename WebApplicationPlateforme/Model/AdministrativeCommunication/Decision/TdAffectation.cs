﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.Global;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.AdministrativeCommunication.Decision
{
    public class TdAffectation
    {
        public int Id { get; set; }


        public string iduserAffected { get; set; }
        public string idUserQuiAffecte { get; set; }
        public string nomUserAffected { get; set; }
        public string nomUserQuiAffecte { get; set; }
        public string dateFin { get; set; }
        public string nbPj { get; set; }
        public string details { get; set; }
        public string action { get; set; }
        public string type { get; set; }

        [ForeignKey("Administration")]
        public int? idAdministration { get; set; }
        public string nomOrganisme { get; set; }

        public int? attribut1 { get; set; }
        public string attribut2 { get; set; }
        public string attribut3 { get; set; }
        public string attribut4 { get; set; }
        public string attribut5 { get; set; }
        public string attribut6 { get; set; }

        public string CreatorName { get; set; }

        [ForeignKey("Decision")]
        public int idTransaction { get; set; }

        [ForeignKey("ApplicationUser")]
        public string IdUserCreator { get; set; }

        public string datenereg { get; set; }




        public virtual ApplicationUser ApplicationUser { get; set; }
        public virtual Decision Decision { get; set; }
        public virtual Administration Administration { get; set; }
    }
}
