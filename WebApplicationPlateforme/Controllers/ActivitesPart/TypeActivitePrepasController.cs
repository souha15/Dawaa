﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.ActivitePart;

namespace WebApplicationPlateforme.Controllers.ActivitesPart
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeActivitePrepasController : ControllerBase
    {
        private readonly DawaaContext _context;

        public TypeActivitePrepasController(DawaaContext context)
        {
            _context = context;
        }

        // GET: api/TypeActivitePrepas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TypeActivitePrepa>>> GetTypeActivitePrepas()
        {
            return await _context.TypeActivitePrepas.ToListAsync();
        }

        // GET: api/TypeActivitePrepas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TypeActivitePrepa>> GetTypeActivitePrepa(int id)
        {
            var typeActivitePrepa = await _context.TypeActivitePrepas.FindAsync(id);

            if (typeActivitePrepa == null)
            {
                return NotFound();
            }

            return typeActivitePrepa;
        }

        // PUT: api/TypeActivitePrepas/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTypeActivitePrepa(int id, TypeActivitePrepa typeActivitePrepa)
        {
            if (id != typeActivitePrepa.Id)
            {
                return BadRequest();
            }

            _context.Entry(typeActivitePrepa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TypeActivitePrepaExists(id))
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

        // POST: api/TypeActivitePrepas
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<TypeActivitePrepa>> PostTypeActivitePrepa(TypeActivitePrepa typeActivitePrepa)
        {
            _context.TypeActivitePrepas.Add(typeActivitePrepa);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTypeActivitePrepa", new { id = typeActivitePrepa.Id }, typeActivitePrepa);
        }

        // DELETE: api/TypeActivitePrepas/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TypeActivitePrepa>> DeleteTypeActivitePrepa(int id)
        {
            var typeActivitePrepa = await _context.TypeActivitePrepas.FindAsync(id);
            if (typeActivitePrepa == null)
            {
                return NotFound();
            }

            _context.TypeActivitePrepas.Remove(typeActivitePrepa);
            await _context.SaveChangesAsync();

            return typeActivitePrepa;
        }

        private bool TypeActivitePrepaExists(int id)
        {
            return _context.TypeActivitePrepas.Any(e => e.Id == id);
        }
    }
}
