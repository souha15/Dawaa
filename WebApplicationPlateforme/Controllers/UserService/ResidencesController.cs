﻿using System;
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
    public class ResidencesController : ControllerBase
    {
        private readonly FinanceContext _context;

        public ResidencesController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/Residences
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Residence>>> Getresidences()
        {
            return await _context.residences.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/Residences/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Residence>> GetResidence(int id)
        {
            var residence = await _context.residences.FindAsync(id);

            if (residence == null)
            {
                return NotFound();
            }

            return residence;
        }

        // PUT: api/Residences/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutResidence(int id, Residence residence)
        {
            if (id != residence.Id)
            {
                return BadRequest();
            }

            _context.Entry(residence).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResidenceExists(id))
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

        // POST: api/Residences
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Residence>> PostResidence(Residence residence)
        {
            _context.residences.Add(residence);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetResidence", new { id = residence.Id }, residence);
        }

        // DELETE: api/Residences/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Residence>> DeleteResidence(int id)
        {
            var residence = await _context.residences.FindAsync(id);
            if (residence == null)
            {
                return NotFound();
            }

            _context.residences.Remove(residence);
            await _context.SaveChangesAsync();

            return residence;
        }

        private bool ResidenceExists(int id)
        {
            return _context.residences.Any(e => e.Id == id);
        }

        [HttpGet]
        [Route("GetRhList/{Id}")]
        public List<Residence> GetRhList(int id)
        {
            Residence obj = new Residence();
            List<Residence> list = new List<Residence>();
            list = _context.residences.Where(item => item.etatdir == "في الانتظار").OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.residences.Where(item => item.Id == id && item.etatdir == "في الانتظار").FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetRhListGeneral")]
        public List<Residence> GetRhListGeneral()
        {

            List<Residence> list = new List<Residence>();
            list = _context.residences.Where(item => item.etatdir == "في الانتظار").OrderBy(item => item.Id).ToList();
            return list;
        }

        [HttpGet]
        [Route("GetUserList/{Id}/{IdUser}")]
        public List<Residence> GetUserList(int id, string IdUser)
        {
            Residence obj = new Residence();
            List<Residence> list = new List<Residence>();
            list = _context.residences.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();

            if (id != 0)
            {
                obj = _context.residences.Where(item => item.Id == id && item.idUserCreator == IdUser).FirstOrDefault();
                var item = list.Find(x => x.Id == obj.Id);
                list.Remove(item);
                list.Insert(list.Count(), obj);

            }

            return list;
        }

        [HttpGet]
        [Route("GetUserListGeneral/{IdUser}")]
        public List<Residence> GetUserListGeneral(string IdUser)
        {

            List<Residence> list = new List<Residence>();
            list = _context.residences.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();
            return list;
        }

    }
}
