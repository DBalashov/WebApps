using System;
using System.Threading.Tasks;
using APIShared;
using Microsoft.AspNetCore.Mvc;

namespace WebMapBus.Controllers
{
    public class HomeController : Controller
    {
        readonly ConfigurationSettings settings;
        
        public HomeController(ConfigurationSettings settings)
        {
            this.settings = settings;
        }
        
        public async Task<IActionResult> Index()
        {
            return View(await HomeIndexModel.Create(settings));
        }
    }
}