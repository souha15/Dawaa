﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.Msg_Interne;

namespace WebApplicationPlateforme.Controllers.Messages2
{
    [Route("api/[controller]")]
    [ApiController]
    public class MsgInternesController : ControllerBase
    {
        private readonly FinanceContext _context;

        public MsgInternesController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/MsgInternes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MsgInterne>>> GetmsgInternes()
        {
            return await _context.msgInternes.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/MsgInternes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MsgInterne>> GetMsgInterne(int id)
        {
            var msgInterne = await _context.msgInternes.FindAsync(id);

            if (msgInterne == null)
            {
                return NotFound();
            }

            return msgInterne;
        }

        // PUT: api/MsgInternes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMsgInterne(int id, MsgInterne msgInterne)
        {
            if (id != msgInterne.Id)
            {
                return BadRequest();
            }

            _context.Entry(msgInterne).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MsgInterneExists(id))
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

        // POST: api/MsgInternes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<MsgInterne>> PostMsgInterne(MsgInterne msgInterne)
        {
            _context.msgInternes.Add(msgInterne);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMsgInterne", new { id = msgInterne.Id }, msgInterne);
        }

        // DELETE: api/MsgInternes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MsgInterne>> DeleteMsgInterne(int id)
        {
            var msgInterne = await _context.msgInternes.FindAsync(id);
            if (msgInterne == null)
            {
                return NotFound();
            }

            _context.msgInternes.Remove(msgInterne);
            await _context.SaveChangesAsync();

            return msgInterne;
        }


        // Get Users Messages 
        [HttpGet]
        [Route("GetUsersMsg/{idUserReceiver}")]
        public List<MsgInterne> GetUsersMsg(string idUserReceiver)
        {
            List<MsgInterne> msgListFirst = new List<MsgInterne>();
            List<MsgInterne> msgList = new List<MsgInterne>();

            msgListFirst = _context.msgInternes.Where(item => item.userIdReceiver == idUserReceiver).ToList();

            msgList = msgListFirst.GroupBy(item=> new { item.userIdReceiver , item.userIdSender})
                 .Select(grouping => grouping.FirstOrDefault())
                .ToList();
            msgList.OrderBy(item => item.Id);
            return msgList;
        }

        // Get Users Conversation 
        [HttpGet]
        [Route("GetUserConversation/{idUserReceiver}/{idUserSender}")]
        public List<MsgInterne> GetUserConversation(string idUserReceiver, string idUserSender)
        {
            List<MsgInterne> msgList = new List<MsgInterne>();

            msgList = _context.msgInternes.Where(item => (item.userIdReceiver == idUserReceiver && item.userIdSender == idUserSender)||(item.userIdReceiver == idUserSender && item.userIdSender == idUserReceiver))
               .OrderBy(item => item.Id)
                .ToList();
     
            return msgList;
        }


        private bool MsgInterneExists(int id)
        {
            return _context.msgInternes.Any(e => e.Id == id);
        }
    }
}
