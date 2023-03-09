using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.Demande_Besoins;

namespace WebApplicationPlateforme.Controllers.DemandeBesoins
{
    [Route("api/[controller]")]
    [ApiController]
    public class besoinsController : ControllerBase
    {
        private readonly DawaaDataContext _context;

        public besoinsController(DawaaDataContext context)
        {
            _context = context;
        }

        // GET: api/besoins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<besoin>>> Getbesoin()
        {
            return await _context.Besoins.ToListAsync();
        }

        // GET: api/besoins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<besoin>> Getbesoin(int id)
        {
            var besoin = await _context.Besoins.FindAsync(id);

            if (besoin == null)
            {
                return NotFound();
            }

            return besoin;
        }

        // PUT: api/besoins/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> Putbesoin(int id, besoin besoin)
        {
            if (id != besoin.Id)
            {
                return BadRequest();
            }

            _context.Entry(besoin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!besoinExists(id))
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

        // POST: api/besoins
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<besoin>> Postbesoin(besoin besoin)
        {
            _context.Besoins.Add(besoin);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getbesoin", new { id = besoin.Id }, besoin);
        }

        // DELETE: api/besoins/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<besoin>> Deletebesoin(int id)
        {
            var besoin = await _context.Besoins.FindAsync(id);
            if (besoin == null)
            {
                return NotFound();
            }

            _context.Besoins.Remove(besoin);
            await _context.SaveChangesAsync();

            return besoin;
        }

        private bool besoinExists(int id)
        {
            return _context.Besoins.Any(e => e.Id == id);
        }
    }
}
