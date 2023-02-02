using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.FinancePartTwo.Cheques;

namespace WebApplicationPlateforme.Controllers.FinancePartTwo.Cheque
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemandePayChequesController : ControllerBase
    {
        private readonly FinanceContext _context;

        public DemandePayChequesController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/DemandePayCheques
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DemandePayCheque>>> GetdemandePayCheques()
        {
            return await _context.demandePayCheques.OrderBy(item => item.Id).ToListAsync();
        }

        // GET: api/DemandePayCheques/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DemandePayCheque>> GetDemandePayCheque(int id)
        {
            var demandePayCheque = await _context.demandePayCheques.FindAsync(id);

            if (demandePayCheque == null)
            {
                return NotFound();
            }

            return demandePayCheque;
        }

        // PUT: api/DemandePayCheques/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDemandePayCheque(int id, DemandePayCheque demandePayCheque)
        {
            if (id != demandePayCheque.Id)
            {
                return BadRequest();
            }

            _context.Entry(demandePayCheque).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DemandePayChequeExists(id))
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

        // POST: api/DemandePayCheques
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DemandePayCheque>> PostDemandePayCheque(DemandePayCheque demandePayCheque)
        {
            
                DateTimeOffset value = DateTimeOffset.Now;
            string fmt = "d";
            string date = value.Date.ToString(fmt);
            int diff = (Convert.ToDateTime(date) - Convert.ToDateTime(demandePayCheque.dateEntre)).Days;
            if (diff <= 0)
            {
                demandePayCheque.numdem = getLastId() + 1;
            _context.demandePayCheques.Add(demandePayCheque);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDemandePayCheque", new { id = demandePayCheque.Id }, demandePayCheque);
            }
            else
            {
                return NotFound();
            }
        }
        public int getLastId()
        {
            var last = _context.demandePayCheques.OrderByDescending(item=> item.Id).FirstOrDefault();
            return last.Id;
        }
        // DELETE: api/DemandePayCheques/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DemandePayCheque>> DeleteDemandePayCheque(int id)
        {
            var demandePayCheque = await _context.demandePayCheques.FindAsync(id);
            if (demandePayCheque == null)
            {
                return NotFound();
            }

            _context.demandePayCheques.Remove(demandePayCheque);
            await _context.SaveChangesAsync();

            return demandePayCheque;
        }

        [HttpGet]
        [Route("SearchByPrix/{prix}")]
        public List<DemandePayCheque> SearchByPrix(string prix)
        {
            return _context.demandePayCheques.Where(item=> item.prixnb == prix).OrderBy(item => item.Id).ToList();
        }

        [HttpGet]
        [Route("SearchByNumDem/{NumDem}")]
        public List<DemandePayCheque> SearchByNumDem(int NumDem)
        {
            return _context.demandePayCheques.Where(item => item.numdem == NumDem).OrderBy(item => item.Id).ToList();
        }

        [HttpGet]
        [Route("SearchByPrixNumDem/{NumDem}/{prix}")]
        public List<DemandePayCheque> SearchByPrixNumDem(int NumDem, string prix)
        {
            return _context.demandePayCheques.Where(item => item.numdem == NumDem && item.prixnb == prix).OrderBy(item => item.Id).ToList();
        }

        [HttpGet]
        [Route("GetUserPayChequeDemands/{IdUser}/{directorName}")]
        public List<DemandePayCheque> GetUserPayChequeDemands(string IdUser,string directorName)
        {
            List<DemandePayCheque> listPay = new List<DemandePayCheque>();
            listPay = _context.demandePayCheques.Where(item => item.idUserCreator == IdUser).OrderBy(item => item.Id).ToList();

            foreach (DemandePayCheque item in listPay)
            {
                if (item.etatdirecteur == "في الإنتظار")
                {
                    item.attribut6 = directorName;

            } else if (item.etatdirecteur == "معتمدة" && item.etatfinacier == "في الإنتظار")
            {
                    item.attribut6 = item.nomfinancier;
            }
            else if (item.etatparfinancier == "في الإنتظار" && item.etatfinacier == "معتمدة" && item.etatdirecteur == "معتمدة")
            {
                    item.attribut6 = item.nomparfinancier;
          }
            else if (item.etatparfinancier == "معتمدة" && item.etatfinacier == "معتمدة" && item.etatdirecteur == "معتمدة" && item.etatadmin == "في الإنتظار")
            {
                    item.attribut6 = item.nomadmin;
          }

            else if (item.etatgeneral == "معتمدة")
            {
                    item.attribut6 = item.nomadmin;
          }
            if (item.etatdirecteur == "مرفوضة")
            {
                item.attribut6 = item.nomdir;
            }
            else if (item.etatfinacier == "مرفوضة")
            {
                    item.attribut6 = item.nomfinancier;
          }
            else if (item.etatparfinancier == "مرفوضة")
            {
                    item.attribut6 = item.nomparfinancier;
          }
            else if (item.etatadmin == "مرفوضة")
            {
                    item.attribut6 = item.nomadmin;
          }
        }
            return listPay;
        }


        private bool DemandePayChequeExists(int id)
        {
            return _context.demandePayCheques.Any(e => e.Id == id);
        }
    }
}
