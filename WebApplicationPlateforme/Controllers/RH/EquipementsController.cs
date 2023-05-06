using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.Ressource_Humaines;

namespace WebApplicationPlateforme.Controllers.RH
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipementsController : ControllerBase
    {
        private readonly FinanceContext _context;

        public EquipementsController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/Equipements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipement>>> Getequipements()
        {
            return await _context.equipements.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/Equipements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Equipement>> GetEquipement(int id)
        {
            var equipement = await _context.equipements.FindAsync(id);

            if (equipement == null)
            {
                return NotFound();
            }

            return equipement;
        }

        // PUT: api/Equipements/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipement(int id, Equipement equipement)
        {
            if (id != equipement.Id)
            {
                return BadRequest();
            }

            _context.Entry(equipement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipementExists(id))
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

        // POST: api/Equipements
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Equipement>> PostEquipement(Equipement equipement)
        {
            _context.equipements.Add(equipement);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEquipement", new { id = equipement.Id }, equipement);
        }

        // DELETE: api/Equipements/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Equipement>> DeleteEquipement(int id)
        {
            var equipement = await _context.equipements.FindAsync(id);
            if (equipement == null)
            {
                return NotFound();
            }

            _context.equipements.Remove(equipement);
            await _context.SaveChangesAsync();

            return equipement;
        }

        private bool EquipementExists(int id)
        {
            return _context.equipements.Any(e => e.Id == id);
        }

        [HttpGet]
        [Route("GetDotList/{Id}")]
        public List<Equipement> GetDotList(int id)
        {
            Equipement obj = new Equipement();
            List<Equipement> list = new List<Equipement>();
            list = _context.equipements.Where(item => item.attribut4 == "في الانتظار" && item.etatdir == "موافق").OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.equipements.Where(item => item.Id == id && item.attribut4 == "في الانتظار" && item.etatdir == "موافق").FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetDotListGeneral")]
        public List<Equipement> GetDotListGeneral()
        {
          
            List<Equipement> list = new List<Equipement>();
            list = _context.equipements.Where(item => item.attribut4 == "في الانتظار" && item.etatdir == "موافق").OrderBy(item => item.Id).ToList();
            return list;
        }


        [HttpGet]
        [Route("GetDirList/{Id}/{idUser}")]
        public List<Equipement> GetDirList(int id, string idUser)
        {
            Equipement obj = new Equipement();
            List<Equipement> list = new List<Equipement>();
            list = _context.equipements.Where(item => item.etatdir == "في الانتظار" && item.iddir == idUser).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.equipements.Where(item => item.Id == id && item.etatdir == "في الانتظار" && item.iddir == idUser).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetDirListGeneral/{idUser}")]
        public List<Equipement> GetDirListGeneral(string idUser)
        {
         
            List<Equipement> list = new List<Equipement>();
            list = _context.equipements.Where(item => item.etatdir == "في الانتظار" && item.iddir == idUser).OrderBy(item => item.Id).ToList();
            return list;
        }

        [HttpGet]
        [Route("GetUserList/{Id}/{IdUser}")]
        public List<Equipement> GetUserList(int id, string IdUser)
        {
            Equipement obj = new Equipement();
            List<Equipement> list = new List<Equipement>();
            list = _context.equipements.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.equipements.Where(item => item.Id == id && item.idUserCreator == IdUser).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetUserListGeneral/{IdUser}")]
        public List<Equipement> GetUserListGeneral(string IdUser)
        {
            
            List<Equipement> list = new List<Equipement>();
            list = _context.equipements.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();
            return list;
        }

    }
}
