﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.ServiceRh
{
    public class ReceptionEquipement
    {
        public int Id { get; set; }
        public string username { get; set; }

        [ForeignKey("ApplicationUser")]
        public string userId { get; set; }
        public string admin {get;set;}     
        public string daterecep{get;set;}
        public string equi{get;set;}
        public string quantite{get;set;}
        public string typeEqui{get;set;}
        public string etatEqui {get;set;}
        public int attribut1 { get; set; }
        public string attribut2 { get; set; }
        public string attribut3 { get; set; }
        public string attribut4 { get; set; }
        public string attribut5 { get; set; }
        public string attribut6 { get; set; }
        public string dateenreg { get; set; }
        public string userNameCreator { get; set; }

        public string idUserCreator { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
