using System;
using System.Runtime.Serialization;

namespace AutoGRAPHService
{
    [DataContract]
    public class REnumGeofences
    {
        [DataMember] public string ID { get; set; }
        [DataMember] public RGroupItem[] Groups { get; set; }
        [DataMember] public RGeofenceItem[] Items { get; set; }
    }

    public class RGeofenceItem : RGroupItem
    {
        public RProperty[] Properties { get; set; }
        public string Image { get; set; }        
    }
}