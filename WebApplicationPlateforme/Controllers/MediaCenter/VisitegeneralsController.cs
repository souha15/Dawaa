using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.MediaCenter;

namespace WebApplicationPlateforme.Controllers.MediaCenter
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitegeneralsController : ControllerBase
    {
        private readonly DawaaDataContext _context;

        public VisitegeneralsController(DawaaDataContext context)
        {
            _context = context;
        }

        // GET: api/Visitegenerals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visitegeneral>>> GetVisitegenerals()
        {
            return await _context.Visitegenerals.ToListAsync();
        }

        // GET: api/Visitegenerals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Visitegeneral>> GetVisitegeneral(int id)
        {
            var visitegeneral = await _context.Visitegenerals.FindAsync(id);

            if (visitegeneral == null)
            {
                return NotFound();
            }

            return visitegeneral;
        }

        // PUT: api/Visitegenerals/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVisitegeneral(int id, Visitegeneral visitegeneral)
        {
            if (id != visitegeneral.Id)
            {
                return BadRequest();
            }

            _context.Entry(visitegeneral).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VisitegeneralExists(id))
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

        // POST: api/Visitegenerals
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Visitegeneral>> PostVisitegeneral(Visitegeneral visitegeneral)
        {
            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int day = value.Day;
            int month = value.Month;
            int year = value.Year;
            visitegeneral.dateenreg = year.ToString() + '-' + month.ToString() + '-' + day.ToString();
            _context.Visitegenerals.Add(visitegeneral);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVisitegeneral", new { id = visitegeneral.Id }, visitegeneral);
        }


        [HttpGet]
        [Route("SearchByEmployee/{Id}")]
        public List<Visitegeneral> SearchByAllEmployee(string Id)
        {
            return _context.Visitegenerals.Where(item => item.idUserCreator == Id).OrderByDescending(item => item.Id).ToList();
        }

        // DELETE: api/Visitegenerals/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Visitegeneral>> DeleteVisitegeneral(int id)
        {
            var visitegeneral = await _context.Visitegenerals.FindAsync(id);
            if (visitegeneral == null)
            {
                return NotFound();
            }

            _context.Visitegenerals.Remove(visitegeneral);
            await _context.SaveChangesAsync();

            return visitegeneral;
        }

        private bool VisitegeneralExists(int id)
        {
            return _context.Visitegenerals.Any(e => e.Id == id);
        }
    }
}
