using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplicationPlateforme.Model.Demande_Besoins;
using WebApplicationPlateforme.Model.DepartEmployee;
using WebApplicationPlateforme.Model.MediaCenter;

namespace WebApplicationPlateforme.Data
{
    public class DawaaDataContext : IdentityDbContext
    {
        public DawaaDataContext(DbContextOptions<DawaaDataContext> options) : base(options) { }

        // Demande Besoins Data
        public DbSet<DemandeBesoin> DemandeBesoins { get; set; }
        public DbSet<besoin> Besoins { get; set; }

        // Depart Employee Data 

        public DbSet<Depart> Departs { get; set; }

        /*** Media Center Visite **/

        public DbSet<Visitegeneral> Visitegenerals { get; set; }
    }
}
