﻿using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class CongesController : ControllerBase
    {
        private readonly FinanceContext _context;

        public CongesController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/Conges
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Conge>>> Getconges()
        {
            return await _context.conges.OrderBy(item=> item.Id).ToListAsync();
        }

        // GET: api/Conges/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Conge>> GetConge(int id)
        {
            var conge = await _context.conges.FindAsync(id);

            if (conge == null)
            {
                return NotFound();
            }

            return conge;
        }

        // PUT: api/Conges/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConge(int id, Conge conge)
        {
            if (id != conge.Id)
            {
                return BadRequest();
            }

            _context.Entry(conge).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CongeExists(id))
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

        // POST: api/Conges
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Conge>> PostConge(Conge conge)
        {
           
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(conge.datedebut)).Days;
            if (diff <= 0) {
                _context.conges.Add(conge);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetConge", new { id = conge.Id }, conge);
            }
            else
            {
                return NotFound();
            }
        }

        public int diffbetweenTwoDates(string dateEnreg)
        {
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(dateEnreg)).Days;
            return diff;
        }

        // DELETE: api/Conges/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Conge>> DeleteConge(int id)
        {
            var conge = await _context.conges.FindAsync(id);
            if (conge == null)
            {
                return NotFound();
            }

            _context.conges.Remove(conge);
            await _context.SaveChangesAsync();

            return conge;
        }

        private bool CongeExists(int id)
        {
            return _context.conges.Any(e => e.Id == id);
        }


        [HttpGet]
        [Route("GetDirList/{Id}/{idUser}")]
        public List<Conge> GetDirList(int id, string idUser)
        {
            Conge obj = new Conge();
            List<Conge> list = new List<Conge>();
            list = _context.conges.Where(item => item.directeurid == idUser && item.etatd == "في الانتظار").OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.conges.Where(item => item.Id == id &&  item.directeurid == idUser && item.etatd == "في الانتظار").FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetDirFinList/{Id}")]
        public List<Conge> GetDirFinList(int id)
        {
            Conge obj = new Conge();
            List<Conge> list = new List<Conge>();
            list = _context.conges.Where(item => item.etatd == "موافق" && item.attribut6 == "في الانتظار" && item.transferera == null).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.conges.Where(item => item.Id == id && item.etatd == "موافق" && item.attribut6 == "في الانتظار" && item.transferera == null).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }


        [HttpGet]
        [Route("GetDirListGeneral/{idUser}")]
        public List<Conge> GetDirListGeneral(string idUser)
        {
            Conge obj = new Conge();
            List<Conge> list = new List<Conge>();
            list = _context.conges.Where(item => item.directeurid == idUser && item.etatd == "في الانتظار").OrderBy(item => item.Id).ToList();
            return list;
        }

        [HttpGet]
        [Route("GetDirFinListGeneral")]
        public List<Conge> GetDirFinListGeneral()
        {
            Conge obj = new Conge();
            List<Conge> list = new List<Conge>();
            list = _context.conges.Where(item => item.etatd == "موافق" && item.attribut6 == "في الانتظار" && item.transferera == null).OrderBy(item => item.Id).ToList();
            return list;
        }

        [HttpGet]
        [Route("GetUserList/{Id}/{IdUser}")]
        public List<Conge> GetUserList(int id, string IdUser)
        {
            Conge obj = new Conge();
            List<Conge> list = new List<Conge>();
            list = _context.conges.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.conges.Where(item => item.Id == id && item.idUserCreator == IdUser).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetUserListGeneral/{IdUser}")]
        public List<Conge> GetUserListGeneral(string IdUser)
        {
            Conge obj = new Conge();
            List<Conge> list = new List<Conge>();
            list = _context.conges.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();
            return list;
        }


        [HttpGet]
        [Route("GetRhList/{Id}")]
        public List<Conge> GetRhList(int id)
        {
            Conge obj = new Conge();
            List<Conge> list = new List<Conge>();
            list = _context.conges.Where(item => item.etatrh == "في الانتظار" && (item.transferera == "2" || item.transferera == "3" || item.attribut6 == "إعتماد بخصم" || item.attribut6 == "إعتماد بغير خصم")).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.conges.Where(item => item.Id == id && item.etatrh == "في الانتظار" && (item.transferera == "2" || item.transferera == "3" || item.attribut6 == "إعتماد بخصم" || item.attribut6 == "إعتماد بغير خصم") ).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }
        [HttpGet]
        [Route("GetRhListGeneral")]
        public List<Conge> GetRhListGeneral()
        {
            Conge obj = new Conge();
            List<Conge> list = new List<Conge>();
            list = _context.conges.Where(item => item.etatrh == "في الانتظار" && (item.transferera == "2" || item.transferera == "3" || item.attribut6 == "إعتماد بخصم" || item.attribut6 == "إعتماد بغير خصم")).OrderBy(item => item.Id).ToList();
            return list;
        }

    }
}
