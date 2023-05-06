using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.User_Services;

namespace WebApplicationPlateforme.Controllers.UserService
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemissionsController : ControllerBase
    {
        private readonly FinanceContext _context;

        public DemissionsController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/Demissions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Demission>>> Getdemissions()
        {
            return await _context.demissions.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/Demissions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Demission>> GetDemission(int id)
        {
            var demission = await _context.demissions.FindAsync(id);

            if (demission == null)
            {
                return NotFound();
            }

            return demission;
        }

        // PUT: api/Demissions/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDemission(int id, Demission demission)
        {
            if (id != demission.Id)
            {
                return BadRequest();
            }

            _context.Entry(demission).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DemissionExists(id))
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

        // POST: api/Demissions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Demission>> PostDemission(Demission demission)
        {
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(demission.date)).Days;
            if (diff <= 0)
            {
                _context.demissions.Add(demission);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDemission", new { id = demission.Id }, demission);
        }
            else
            {
                return NotFound();
    }
}

        // DELETE: api/Demissions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Demission>> DeleteDemission(int id)
        {
            var demission = await _context.demissions.FindAsync(id);
            if (demission == null)
            {
                return NotFound();
            }

            _context.demissions.Remove(demission);
            await _context.SaveChangesAsync();

            return demission;
        }

        private bool DemissionExists(int id)
        {
            return _context.demissions.Any(e => e.Id == id);
        }

        [HttpGet]
        [Route("GetRhList/{Id}")]
        public List<Demission> GetRhList(int id)
        {
            Demission obj = new Demission();
            List<Demission> list = new List<Demission>();
            list = _context.demissions.Where(item => item.etatrh == "في الانتظار" && item.etatdir == "موافق").OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.demissions.Where(item => item.Id == id && item.etatrh == "في الانتظار" && item.etatdir == "موافق").FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }


        [HttpGet]
        [Route("GetUserList/{Id}/{IdUser}")]
        public List<Demission> GetUserList(int id, string IdUser)
        {
            Demission obj = new Demission();
            List<Demission> list = new List<Demission>();
            list = _context.demissions.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.demissions.Where(item => item.Id == id && item.idUserCreator == IdUser).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetUserListGeneral/{IdUser}")]
        public List<Demission> GetUserListGeneral(string IdUser)
        {
            Demission obj = new Demission();
            List<Demission> list = new List<Demission>();
            list = _context.demissions.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();
            return list;
        }

        [HttpGet]
        [Route("GetRhListGeneral")]
        public List<Demission> GetRhListGeneral()
        {
            Demission obj = new Demission();
            List<Demission> list = new List<Demission>();
            list = _context.demissions.Where(item => item.etatrh == "في الانتظار" && item.etatdir == "موافق").OrderBy(item => item.Id).ToList();
            return list;
        }


        [HttpGet]
        [Route("GetDirList/{Id}/{idUser}")]
        public List<Demission> GetDirList(int id, string idUser)
        {
            Demission obj = new Demission();
            List<Demission> list = new List<Demission>();
            list = _context.demissions.Where(item => item.etatdir == "في الانتظار" && item.iddir == idUser).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.demissions.Where(item => item.Id == id && item.etatdir == "في الانتظار" && item.iddir == idUser).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetDirListGeneral/{idUser}")]
        public List<Demission> GetDirListGeneral(string idUser)
        {
            Demission obj = new Demission();
            List<Demission> list = new List<Demission>();
            list = _context.demissions.Where(item => item.etatdir == "في الانتظار" && item.iddir == idUser).OrderBy(item => item.Id).ToList();
            return list;
        }
    }
}
