﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.MediaCenter.CadeauxSouvenirs;

namespace WebApplicationPlateforme.Controllers.MediaCenter.CadeauSouve
{
    [Route("api/[controller]")]
    [ApiController]
    public class CadeauxController : ControllerBase
    {
        private readonly FinanceContext _context;

        public CadeauxController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/Cadeaux
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cadeaux>>> GetCadeaux()
        {
            return await _context.Cadeaux.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/Cadeaux/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cadeaux>> GetCadeaux(int id)
        {
            var cadeaux = await _context.Cadeaux.FindAsync(id);

            if (cadeaux == null)
            {
                return NotFound();
            }

            return cadeaux;
        }

        // PUT: api/Cadeaux/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCadeaux(int id, Cadeaux cadeaux)
        {
            if (id != cadeaux.Id)
            {
                return BadRequest();
            }

            _context.Entry(cadeaux).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CadeauxExists(id))
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

        // POST: api/Cadeaux
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Cadeaux>> PostCadeaux(Cadeaux cadeaux)
        {

            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int day = value.Day;
            int month = value.Month;
            int year = value.Year;
            cadeaux.dateenreg = year.ToString() + '-' + month.ToString() + '-' + day.ToString();
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(cadeaux.dateTime)).Days;
            if (diff <= 0)
            {
                _context.Cadeaux.Add(cadeaux);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCadeaux", new { id = cadeaux.Id }, cadeaux);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        [Route("SearchByEmployee/{Id}")]
        public List<Cadeaux> SearchByAllEmployee(string Id)
        {
            return _context.Cadeaux.Where(item => item.idUserCreator == Id).OrderByDescending(item => item.Id).ToList();
        }

        // DELETE: api/Cadeaux/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Cadeaux>> DeleteCadeaux(int id)
        {
            var cadeaux = await _context.Cadeaux.FindAsync(id);
            if (cadeaux == null)
            {
                return NotFound();
            }

            _context.Cadeaux.Remove(cadeaux);
            await _context.SaveChangesAsync();

            return cadeaux;
        }

        private bool CadeauxExists(int id)
        {
            return _context.Cadeaux.Any(e => e.Id == id);
        }
    }
}
