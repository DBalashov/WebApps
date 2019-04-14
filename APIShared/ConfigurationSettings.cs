namespace APIShared
{
    public class Configuration
    {
        public ConfigurationSettings Settings { get; set; }
    }
    
    public class ConfigurationSettings
    {
        public string Url { get; set; }
        public string SchemaName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}