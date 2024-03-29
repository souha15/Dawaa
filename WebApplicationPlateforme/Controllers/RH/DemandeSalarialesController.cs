﻿using System;
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
    public class DemandeSalarialesController : ControllerBase
    {
        private readonly FinanceContext _context;

        public DemandeSalarialesController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/DemandeSalariales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DemandeSalariale>>> GetdemandeSalariales()
        {
            return await _context.demandeSalariales.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/DemandeSalariales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DemandeSalariale>> GetDemandeSalariale(int id)
        {
            var demandeSalariale = await _context.demandeSalariales.FindAsync(id);

            if (demandeSalariale == null)
            {
                return NotFound();
            }

            return demandeSalariale;
        }

        // PUT: api/DemandeSalariales/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDemandeSalariale(int id, DemandeSalariale demandeSalariale)
        {
            if (id != demandeSalariale.Id)
            {
                return BadRequest();
            }

            _context.Entry(demandeSalariale).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DemandeSalarialeExists(id))
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

        // POST: api/DemandeSalariales
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DemandeSalariale>> PostDemandeSalariale(DemandeSalariale demandeSalariale)
        {
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(demandeSalariale.date)).Days;
            if (diff <= 0)
            {
                _context.demandeSalariales.Add(demandeSalariale);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDemandeSalariale", new { id = demandeSalariale.Id }, demandeSalariale);
        }
            else
            {
                return NotFound();
    }
}

        // DELETE: api/DemandeSalariales/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DemandeSalariale>> DeleteDemandeSalariale(int id)
        {
            var demandeSalariale = await _context.demandeSalariales.FindAsync(id);
            if (demandeSalariale == null)
            {
                return NotFound();
            }

            _context.demandeSalariales.Remove(demandeSalariale);
            await _context.SaveChangesAsync();

            return demandeSalariale;
        }

        private bool DemandeSalarialeExists(int id)
        {
            return _context.demandeSalariales.Any(e => e.Id == id);
        }

        [HttpGet]
        [Route("GetDirList/{Id}/{idUser}")]
        public List<DemandeSalariale> GetDirList(int id, string idUser)
        {
            DemandeSalariale obj = new DemandeSalariale();
            List<DemandeSalariale> list = new List<DemandeSalariale>();
            list = _context.demandeSalariales.Where(item => item.etat == "في الانتظار" && item.dirid == idUser).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.demandeSalariales.Where(item => item.Id == id && item.etat == "في الانتظار" && item.dirid == idUser).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetDirListGeneral/{idUser}")]
        public List<DemandeSalariale> GetDirListGeneral(string idUser)
        {
            DemandeSalariale obj = new DemandeSalariale();
            List<DemandeSalariale> list = new List<DemandeSalariale>();
            list = _context.demandeSalariales.Where(item => item.etat == "في الانتظار" && item.dirid == idUser).OrderBy(item => item.Id).ToList();
            return list;
        }


        [HttpGet]
        [Route("GetUserList/{Id}/{IdUser}")]
        public List<DemandeSalariale> GetUserList(int id, string IdUser)
        {
            DemandeSalariale obj = new DemandeSalariale();
            List<DemandeSalariale> list = new List<DemandeSalariale>();
            list = _context.demandeSalariales.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.demandeSalariales.Where(item => item.Id == id && item.idUserCreator == IdUser).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetUserListGeneral/{IdUser}")]
        public List<DemandeSalariale> GetUserListGeneral(string IdUser)
        {
            DemandeSalariale obj = new DemandeSalariale();
            List<DemandeSalariale> list = new List<DemandeSalariale>();
            list = _context.demandeSalariales.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();
            return list;
        }
    }
}
