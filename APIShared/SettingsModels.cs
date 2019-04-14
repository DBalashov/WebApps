using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AutoGRAPHService;
using Newtonsoft.Json;

namespace APIShared
{
    public class HomeIndexModel
    {
        public string Name { get; set; }
        public SettingUrls Urls { get; set; }
        public string Token { get; set; }
        public CurrentUser User { get; set; }
        public CurrentOrganization Organization { get; set; }
        public Dictionary<string, string> Settings { get; set; }

        public static async Task<HomeIndexModel> Create(ConfigurationSettings settings)
        {
            var m = new HomeIndexModel()
            {
                Name = "Application name here",
                Urls = new SettingUrls()
                {
                    Service = settings.Url + "/ServiceJSON",
                    Relative = "",
                    Content = "",
                    Image = settings.Url + "/Image"
                },
                User = new CurrentUser()
                {
                    Name = settings.UserName,
                    Mail = "example@gmail.com",
                    Login = settings.UserName,
                    UID = Guid.NewGuid(),
                    ID = 0
                }
            };
            
            var c = new HttpClient();
            m.Token = await c.GetStringAsync($"{m.Urls.Service}/Login?UserName={settings.UserName}&Password={settings.Password}");
            var schema = JsonConvert.DeserializeObject<RSchema[]>(await c.GetStringAsync($"{m.Urls.Service}/EnumSchemas?session={m.Token}")).First(p => p.Name.StartsWith(settings.SchemaName));

            m.Organization = new CurrentOrganization()
            {
                Name = schema.Name,
                ID = 0,
                UID = Guid.Parse(schema.ID),
                Props = new Dictionary<string, string>()
            };

            return m;
        }
    }

    public class SettingUrls
    {
        public string Service { get; set; }
        public string Relative { get; set; }
        public string Content { get; set; }
        public string Image { get; set; }
    }

    public class CurrentUser
    {
        public int ID { get; set; }
        public Guid UID { get; set; }
        public string Name { get; set; }
        public string Login { get; set; }
        public string Mail { get; set; }
    }

    public class CurrentOrganization
    {
        public int ID { get; set; }
        public Guid UID { get; set; }
        public string Name { get; set; }
        public Dictionary<string, string> Props { get; set; }
    }
}