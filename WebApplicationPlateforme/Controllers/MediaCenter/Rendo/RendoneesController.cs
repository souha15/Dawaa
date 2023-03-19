﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.MediaCenter.Rondonnee;

namespace WebApplicationPlateforme.Controllers.MediaCenter
{
    [Route("api/[controller]")]
    [ApiController]
    public class RendoneesController : ControllerBase
    {
        private readonly FinanceContext _context;

        public RendoneesController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/Rendonees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rendonee>>> GetRendonee()
        {
            return await _context.Rendonee.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/Rendonees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Rendonee>> GetRendonee(int id)
        {
            var rendonee = await _context.Rendonee.FindAsync(id);

            if (rendonee == null)
            {
                return NotFound();
            }

            return rendonee;
        }

        // PUT: api/Rendonees/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRendonee(int id, Rendonee rendonee)
        {
            if (id != rendonee.Id)
            {
                return BadRequest();
            }

            _context.Entry(rendonee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RendoneeExists(id))
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

        // POST: api/Rendonees
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Rendonee>> PostRendonee(Rendonee rendonee)
        {
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int day = value.Day;
            int month = value.Month;
            int year = value.Year;
            rendonee.dateenreg = year.ToString() + '-' + month.ToString() + '-' + day.ToString();
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(rendonee.dateTime)).Days;
            if (diff <= 0)
            {
                _context.Rendonee.Add(rendonee);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRendonee", new { id = rendonee.Id }, rendonee);
            }
            else
            {
                return NotFound();
            }
        }

        // DELETE: api/Rendonees/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Rendonee>> DeleteRendonee(int id)
        {
            var rendonee = await _context.Rendonee.FindAsync(id);
            if (rendonee == null)
            {
                return NotFound();
            }

            _context.Rendonee.Remove(rendonee);
            await _context.SaveChangesAsync();

            return rendonee;
        }

        [HttpGet]
        [Route("SearchByEmployee/{Id}")]
        public List<Rendonee> SearchByAllEmployee(string Id)
        {
            return _context.Rendonee.Where(item => item.idUserCreator == Id).OrderByDescending(item => item.Id).ToList();
        }
        private bool RendoneeExists(int id)
        {
            return _context.Rendonee.Any(e => e.Id == id);
        }
    }
}
