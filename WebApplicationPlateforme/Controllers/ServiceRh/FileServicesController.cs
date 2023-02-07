using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationPlateforme.Data;
using WebApplicationPlateforme.Model.ServiceRh;

namespace WebApplicationPlateforme.Controllers.ServiceRh
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileServicesController : ControllerBase
    {
        private readonly DawaaContext _context;

        public FileServicesController(DawaaContext context)
        {
            _context = context;
        }

        // GET: api/FileServices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileService>>> GetFilesServices()
        {
            return await _context.FilesServices.ToListAsync();
        }

        // GET: api/FileServices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FileService>> GetFileService(int id)
        {
            var fileService = await _context.FilesServices.FindAsync(id);

            if (fileService == null)
            {
                return NotFound();
            }

            return fileService;
        }

        // PUT: api/FileServices/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFileService(int id, FileService fileService)
        {
            if (id != fileService.Id)
            {
                return BadRequest();
            }

            _context.Entry(fileService).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FileServiceExists(id))
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

        // POST: api/FileServices
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<FileService>> PostFileService(FileService fileService)
        {
            _context.FilesServices.Add(fileService);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFileService", new { id = fileService.Id }, fileService);
        }

        // DELETE: api/FileServices/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FileService>> DeleteFileService(int id)
        {
            var fileService = await _context.FilesServices.FindAsync(id);
            if (fileService == null)
            {
                return NotFound();
            }

            _context.FilesServices.Remove(fileService);
            await _context.SaveChangesAsync();

            return fileService;
        }

        private bool FileServiceExists(int id)
        {
            return _context.FilesServices.Any(e => e.Id == id);
        }

        [HttpGet]
        [Route("GetPermissionFiles/{Id}")]

        public List<FileService> GetPermissionFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Permission").ToList();
            return FilesList;
        } 
        
        [HttpGet]
        [Route("GetEquipementFiles/{Id}")]

        public List<FileService> GetEquipementFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Equipement").ToList();
            return FilesList;
        }
        
        [HttpGet]
        [Route("GetSalarialeFiles/{Id}")]

        public List<FileService> GetSalarialeFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Salariale").ToList();
            return FilesList;
        } 
        
        [HttpGet]
        [Route("GetResidenceFiles/{Id}")]

        public List<FileService> GetResidenceFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Residence").ToList();
            return FilesList;
        }
        
        [HttpGet]
        [Route("GetFormationFiles/{Id}")]

        public List<FileService> GetFormationFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Formation").ToList();
            return FilesList;
        }
        
        [HttpGet]
        [Route("GetAssistanceFiles/{Id}")]

        public List<FileService> GetAssistanceFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Assistance").ToList();
            return FilesList;
        }
        
        [HttpGet]
        [Route("GetOrdrePayFiles/{Id}")]

        public List<FileService> GetOrdrePayFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "OrdrePay").ToList();
            return FilesList;
        }
        
        [HttpGet]
        [Route("GetDemTechFiles/{Id}")]

        public List<FileService> GetDemTechFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "DemTech").ToList();
            return FilesList;
        } 
        
        [HttpGet]
        [Route("GetDemissionFiles/{Id}")]

        public List<FileService> GetDemissionFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Demission").ToList();
            return FilesList;
        } 
        
        [HttpGet]
        [Route("GetAvanceFiles/{Id}")]

        public List<FileService> GetAvanceFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Avance").ToList();
            return FilesList;
        } 
        
        [HttpGet]
        [Route("GetSuppHeureFiles/{Id}")]

        public List<FileService> GetSuppHeureFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "SuppHeure").ToList();
            return FilesList;
        }
        
        [HttpGet]
        [Route("GetCreationFiles/{Id}")]

        public List<FileService> GetCreationFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Creation").ToList();
            return FilesList;
        }
        
        [HttpGet]
        [Route("GetAttestationTravailFiles/{Id}")]

        public List<FileService> GetAttestationTravailFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "AttestationTravail").ToList();
            return FilesList;
        } 
        
        
        [HttpGet]
        [Route("GetVoitureFiles/{Id}")]

        public List<FileService> GetVoitureFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Voiture").ToList();
            return FilesList;
        } 
        
        [HttpGet]
        [Route("GetVenteFiles/{Id}")]

        public List<FileService> GetVenteFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Vente").ToList();
            return FilesList;
        } 
        
        [HttpGet]
        [Route("GetMaintenanceFiles/{Id}")]

        public List<FileService> GetMaintenanceFiles(int Id)
        {
            List<FileService> FilesList = new List<FileService>();
            FilesList = _context.FilesServices.Where(item => item.serviceId == Id && item.serviceName == "Maintenance").ToList();
            return FilesList;
        }
    }
}
