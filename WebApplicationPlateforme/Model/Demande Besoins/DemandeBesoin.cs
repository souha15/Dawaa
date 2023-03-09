using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Model.Demande_Besoins
{
    public class DemandeBesoin
    {
        public int Id { get; set; }
        public string typebBesoin { get; set; }
        public string titre { get; set; }
        public string details { get; set; }
        public string etat{get;set;}
        public string dateEtat { get; set; }
        public string idRh{get;set;}
        public string nomRh {get;set;}
        public string dateRh{get;set;}
        public string etatRh {get;set;}
        public string idFin {get;set;}
        public string nomFin {get;set;}
        public string etatFin {get;set;}
        public string dateFin{get;set;}
        public string dateEnreg{get;set;}
        public string raisonRefus { get; set; }
        public string userNameCreator { get; set; }

        [ForeignKey("ApplicationUser")]
        public string idUserCreator { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
