using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.Allmaintenance;
using WebApplicationPlateforme.Model.User;

namespace WebApplicationPlateforme.Controllers.Maintenance
{
    [Route("api/[controller]")]
    [ApiController]
    public class AllMaintenanceByUserCreatorController : ControllerBase
    {
        private readonly DawaaContext _context;
        private UserManager<ApplicationUser> _userManager;
        public AllMaintenanceByUserCreatorController(UserManager<ApplicationUser> userManager, DawaaContext context)
        {
            _context = context;
            _userManager = userManager;
        }


        public async Task<string> GetUserConnectedAsync()
        {

            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return user.Id;


        }

        public string GetUserDirector(string id)
        {

            var user = _userManager.Users.Where(item => item.Id == id).FirstOrDefault();
            return user.directeur;


        }

        public string GetUserName(string id)
        {

            var user = _userManager.Users.Where(item => item.Id == id).FirstOrDefault();
            return user.FullName;


        }
        [HttpGet("ByUserCreator/{id}")]
        public List<AllTypeOfMaintenance> GetByUserCreator(string id)
        {
            List<AllTypeOfMaintenance> ListByCreatorUser = new List<AllTypeOfMaintenance>();
            ListByCreatorUser = _context.AllTypeOfMaintenance.Where(item => item.idUserCreator == id).ToList();
            return ListByCreatorUser;
        }

        [HttpGet("ByDir/{id}")]
        public List<AllTypeOfMaintenance> GetByDir(string id)
        {
            List<AllTypeOfMaintenance> ListByCreatorUser = new List<AllTypeOfMaintenance>();
            ListByCreatorUser = _context.AllTypeOfMaintenance.Where(item => item.iddir == id && item.etadir == "في الإنتظار").ToList();
            return ListByCreatorUser;
        }

        [HttpGet("ByEmployee/{id}")]
        public List<AllTypeOfMaintenance> GetByEmployee(string id)
        {
            List<AllTypeOfMaintenance> ListByCreatorUser = new List<AllTypeOfMaintenance>();
            ListByCreatorUser = _context.AllTypeOfMaintenance.Where(item => item.employeeid == id && item.etatemployee == "في الإنتظار").ToList();
            return ListByCreatorUser;
        }

        [HttpGet("GetProcessByUser/{id}")]
        public List<AllTypeOfMaintenance> GetProcessByUser(string id)
        {
            List<AllTypeOfMaintenance> ListByCreatorUser = new List<AllTypeOfMaintenance>();
            ListByCreatorUser = _context.AllTypeOfMaintenance.Where(item => item.idUserCreator == id ).OrderBy(item => item.Id).ToList();
            foreach(AllTypeOfMaintenance item in ListByCreatorUser)
            {
                if(item.etadir == "في الإنتظار")
                {
                    item.attribut6 = GetUserDirector(id);
                }else if(item.etadir == "موافقة" && item.etatemployee == "في الإنتظار")
                {
                    item.attribut6 = GetUserName(item.employeeid);
                }
                else if (item.etadir == "موافقة" && item.etatemployee == "موافقة")
                {
                    item.attribut6 = GetUserName(item.employeeid);
                }
                else if (item.etatemployee == "رفض")
                {
                    item.attribut6 = GetUserName(item.employeeid);
                }
                else if (item.etadir == "رفض")
                {
                    item.attribut6 = GetUserDirector(id);
                }
            }
            return ListByCreatorUser;
        }

    }
}