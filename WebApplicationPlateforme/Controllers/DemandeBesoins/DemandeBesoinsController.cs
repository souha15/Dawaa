using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.Demande_Besoins;
using WebApplicationPlateforme.Model.User;
using WebApplicationPlateforme.Services;

namespace WebApplicationPlateforme.Controllers.DemandeBesoins
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemandeBesoinsController : ControllerBase
    {
        private readonly DawaaDataContext _context;
        private UserManager<ApplicationUser> UserManager;
        private readonly ApplicationDbContext ApplicationDbContext;
        public DemandeBesoinsController(DawaaDataContext context,
             UserManager<ApplicationUser> _UserManager, ApplicationDbContext _ApplicationDbContext)
        {
            _context = context;
            UserManager = _UserManager;
            ApplicationDbContext = _ApplicationDbContext;
        }

        // GET: api/DemandeBesoins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DemandeBesoin>>> GetDemandeBesoin()
        {
            return await _context.DemandeBesoins.ToListAsync();
        }

        // GET: api/DemandeBesoins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DemandeBesoin>> GetDemandeBesoin(int id)
        {
            var demandeBesoin = await _context.DemandeBesoins.FindAsync(id);

            if (demandeBesoin == null)
            {
                return NotFound();
            }

            return demandeBesoin;
        }

        // PUT: api/DemandeBesoins/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDemandeBesoin(int id, DemandeBesoin demandeBesoin)
        {
            if (id != demandeBesoin.Id)
            {
                return BadRequest();
            }

            _context.Entry(demandeBesoin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DemandeBesoinExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/DemandeBesoins
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DemandeBesoin>> PostDemandeBesoin(DemandeBesoin demandeBesoin)
        {
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            demandeBesoin.dateEnreg = date;
            demandeBesoin.etat = "في الإنتظار";
            demandeBesoin.etatRh = "في الإنتظار";
            demandeBesoin.etatFin = "في الإنتظار";
            UsersManip us = new UsersManip(UserManager, ApplicationDbContext);

            demandeBesoin.idRh =us.GetRHDir().Id;
            demandeBesoin.nomRh =us.GetRHDir().FullName;
            demandeBesoin.idFin = us.GetFinDir().Id;
            demandeBesoin.nomFin = us.GetFinDir().FullName;

            _context.DemandeBesoins.Add(demandeBesoin);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDemandeBesoin", new { id = demandeBesoin.Id }, demandeBesoin);
        }

        // DELETE: api/DemandeBesoins/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DemandeBesoin>> DeleteDemandeBesoin(int id)
        {
            var demandeBesoin = await _context.DemandeBesoins.FindAsync(id);
            if (demandeBesoin == null)
            {
                return NotFound();
            }

            _context.DemandeBesoins.Remove(demandeBesoin);
            await _context.SaveChangesAsync();

            return demandeBesoin;
        }

        private bool DemandeBesoinExists(int id)
        {
            return _context.DemandeBesoins.Any(e => e.Id == id);
        }

        [HttpGet]
        [Route("GetBesoinsForUserCreator/{userId}")]

        public List<DemandeBesoin> GetBesoinsForUserCreator(string userId)
        {
            List<DemandeBesoin> BesoinList = new List<DemandeBesoin>();
            BesoinList = _context.DemandeBesoins.Where(item => item.idUserCreator == userId).ToList();
            return BesoinList;
        }

        [HttpGet]
        [Route("GetBesoinsDir/{userId}")]

        public List<DemandeBesoin> GetBesoinsForDir(string userId)
        {
            List<DemandeBesoin> BesoinList = new List<DemandeBesoin>();
            UsersManip us = new UsersManip(UserManager, ApplicationDbContext);
   
            
            if (userId == us.GetFinDir().Id)
            {
                BesoinList = _context.DemandeBesoins.Where(item => item.idFin == userId && item.etatFin == "في الإنتظار").ToList();
            }
           
            if (userId == us.GetRHDir().Id)
            {
                BesoinList = _context.DemandeBesoins.Where(item => item.idRh == userId && item.etatRh == "في الإنتظار" && item.etatFin== "موافقة").ToList();
            }
            return BesoinList;
        }

        [HttpPut]
        [Route("PutEtatDir/{userId}/{Id}/{etat}")]

        public async Task<IActionResult> PutEtatDir(string userId, int Id,int etat)
        {
            DemandeBesoin demandeBesoin = new DemandeBesoin();
            UsersManip us = new UsersManip(UserManager, ApplicationDbContext);


            demandeBesoin = _context.DemandeBesoins.Where(item => item.Id == Id).FirstOrDefault();
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);

            if (userId == us.GetFinDir().Id && demandeBesoin.etatFin == "في الإنتظار")
            {
                if(etat == 1) { 
                demandeBesoin.etatFin = "موافقة";
                demandeBesoin.dateFin = date;
                }if(etat == 0)
                {
                    demandeBesoin.etatFin = "رفض";
                    demandeBesoin.dateFin = date;
                    demandeBesoin.etat = "رفض";
                    demandeBesoin.dateEtat = date;
                }
                _context.Entry(demandeBesoin).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DemandeBesoinExists(Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            if (userId == us.GetRHDir().Id && demandeBesoin.etatRh == "في الإنتظار" && demandeBesoin.etatFin == "موافقة")
            {         
                if(etat == 1) {
                    demandeBesoin.etatRh = "موافقة";
                    demandeBesoin.dateRh = date;
                    demandeBesoin.etat = "موافقة";
                    demandeBesoin.dateEtat = date;
                }
                if (etat == 0)
                {
                    demandeBesoin.etatRh = "رفض";
                    demandeBesoin.dateRh = date;
                    demandeBesoin.etat = "رفض";
                    demandeBesoin.dateEtat = date;
                }

                _context.Entry(demandeBesoin).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DemandeBesoinExists(Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            

                return NoContent();
            }
    }
}
