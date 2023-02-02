﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.Ressource_Humaines
{
    public class PrivelegesRequests
    {
        public int Id { get; set; }
        public string privileges { get; set; }
        public string type { get; set; }     
        public string tel { get; set; }
        public string email { get; set; }
        public string transafert { get; set; }
        public string req { get; set; }
        public string etat { get; set; }
        public string etatdir { get; set; }
        public string etatrh { get; set; }
        public string iddir { get; set; }
        public string nomdir { get; set; }
        public string idrh { get; set; }
        public string nomrh { get; set; }
        public string dirdate { get; set; }
        public string rhdate { get; set; }
        public int attribut1 { get; set; }
        public string attribut2 { get; set; }
        public string attribut3 { get; set; }
        public string attribut4 { get; set; }
        public string attribut5 { get; set; }
        public string attribut6 { get; set; }
        public string dateenreg { get; set; }
        public string userNameCreator { get; set; }

        [ForeignKey("ApplicationUser")]
        public string idUserCreator { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
