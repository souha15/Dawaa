﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.Gestion_de_stock
{
    public class TypeStock
    {
        public int Id { get; set; }
        public string nom { get; set; }
        public string unite { get; set; }
        public string num { get; set; }
        public string prix { get; set; }
        public string tot { get; set; }

        public int attribut1 { get; set; }
        public int attribut7 { get; set; }
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
