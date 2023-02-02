﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.ServiceRh
{
    public class DecisionTwo
    {

        public int Id { get; set; }
        public string type { get; set; }
        public string decision { get; set; }
        public string titre { get; set; }
        public string detail { get; set; }
        public string org { get; set; }
        public int adminid { get;set;}
        public string adminnom { get;set;}
        public string alladmin { get;set;}
        public string employeeid { get;set;}
        public string employeenom { get;set;}
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
