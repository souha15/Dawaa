﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.Pointage
{
    public class AddresseMac
    {
        public int Id { get; set; }
        public string adresseMac { get; set; }
        public string date { get; set; }
        public string pcInfos { get; set; }
        public int attribut1 { get; set; }
        public string attribut2 { get; set; }
        public string attribut3 { get; set; }
        public string attribut4 { get; set; }
        public string attribut5 { get; set; }
        public string attribut6 { get; set; }
        public string dateenreg { get; set; }
        public string userName { get; set; }
        public string etabName { get; set; }
        public string adminName { get; set; }

        [ForeignKey("ApplicationUser")]
        public string userId { get; set; }
        public int etabId { get; set; }

        public int adminId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

    }
}
