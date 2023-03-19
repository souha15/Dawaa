using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.MediaCenter.SoireeOccasion;

namespace WebApplicationPlateforme.Controllers.MediaCenter.OccSoiree
{
    [Route("api/[controller]")]
    [ApiController]
    public class OccasionSoireesController : ControllerBase
    {
        private readonly FinanceContext _context;

        public OccasionSoireesController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/OccasionSoirees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OccasionSoiree>>> GetOccasionSoiree()
        {
            return await _context.OccasionSoiree.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/OccasionSoirees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OccasionSoiree>> GetOccasionSoiree(int id)
        {
            var occasionSoiree = await _context.OccasionSoiree.FindAsync(id);

            if (occasionSoiree == null)
            {
                return NotFound();
            }

            return occasionSoiree;
        }

        // PUT: api/OccasionSoirees/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOccasionSoiree(int id, OccasionSoiree occasionSoiree)
        {
            if (id != occasionSoiree.Id)
            {
                return BadRequest();
            }

            _context.Entry(occasionSoiree).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OccasionSoireeExists(id))
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

        // POST: api/OccasionSoirees
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<OccasionSoiree>> PostOccasionSoiree(OccasionSoiree occasionSoiree)
        {
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int day = value.Day;
            int month = value.Month;
            int year = value.Year;
            occasionSoiree.dateenreg = year.ToString() + '-' + month.ToString() + '-' + day.ToString();
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(occasionSoiree.dateTime)).Days;
            if (diff <= 0)
            {
                _context.OccasionSoiree.Add(occasionSoiree);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOccasionSoiree", new { id = occasionSoiree.Id }, occasionSoiree);
        }
            else
            {
                return NotFound();
    }
}
        [HttpGet]
        [Route("SearchByEmployee/{Id}")]
        public List<OccasionSoiree> SearchByAllEmployee(string Id)
        {
            return _context.OccasionSoiree.Where(item => item.idUserCreator == Id).OrderByDescending(item => item.Id).ToList();
        }

        // DELETE: api/OccasionSoirees/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<OccasionSoiree>> DeleteOccasionSoiree(int id)
        {
            var occasionSoiree = await _context.OccasionSoiree.FindAsync(id);
            if (occasionSoiree == null)
            {
                return NotFound();
            }

            _context.OccasionSoiree.Remove(occasionSoiree);
            await _context.SaveChangesAsync();

            return occasionSoiree;
        }

        private bool OccasionSoireeExists(int id)
        {
            return _context.OccasionSoiree.Any(e => e.Id == id);
        }
    }
}
