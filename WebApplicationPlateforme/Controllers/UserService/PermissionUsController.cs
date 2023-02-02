﻿using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class PermissionUsController : ControllerBase
    {
        private readonly FinanceContext _context;

        public PermissionUsController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/PermissionUs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PermissionU>>> GetpermissionUs()
        {
            return await _context.permissionUs.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/PermissionUs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PermissionU>> GetPermissionU(int id)
        {
            var permissionU = await _context.permissionUs.FindAsync(id);

            if (permissionU == null)
            {
                return NotFound();
            }

            return permissionU;
        }

        // PUT: api/PermissionUs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPermissionU(int id, PermissionU permissionU)
        {
            if (id != permissionU.Id)
            {
                return BadRequest();
            }

            _context.Entry(permissionU).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PermissionUExists(id))
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

        // POST: api/PermissionUs
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<PermissionU>> PostPermissionU(PermissionU permissionU)
        {
            //DateTime dateOnly = DateTime.Now;
            //var date = Convert.ToDateTime(dateOnly.ToString("d", new CultureInfo("es-ES")));

            //if (Convert.ToDateTime(permissionU.date) >= date)
            //{


            //}
            //else
            //{
            //    return NotFound();
            //}

            DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(permissionU.date)).Days;
            if (diff <= 0)
            {
                _context.permissionUs.Add(permissionU);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPermissionU", new { id = permissionU.Id }, permissionU);

        }
            else
            {
                return NotFound();
    }
}

        // DELETE: api/PermissionUs/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PermissionU>> DeletePermissionU(int id)
        {

            var permissionU = await _context.permissionUs.FindAsync(id);
            if (permissionU == null)
            {
                return NotFound();
            }

            _context.permissionUs.Remove(permissionU);
            await _context.SaveChangesAsync();

            return permissionU;
        }

        private bool PermissionUExists(int id)
        {
            return _context.permissionUs.Any(e => e.Id == id);
        }
    }
}
