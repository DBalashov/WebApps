﻿using System;
using System.Runtime.Serialization;

namespace AutoGRAPHService
{
    [DataContract]
    public class REnumDrivers
    {
        [DataMember] public string ID { get; set; }
        [DataMember] public RGroupItem[] Groups { get; set; }
        [DataMember] public RDriverItem[] Items { get; set; }

#if DEBUG
        public override string ToString() => "Groups=" + (Groups?.Length.ToString() ?? "NULL") + ", " +
                                             "Items=" + (Items?.Length.ToString() ?? "NULL");
#endif
    }
   
    public class RDriverItem : RGroupItem
    {
        public string DriverID { get; set; }
        public RProperty[] Properties { get; set; }
        public string Image { get; set; }

#if DEBUG
        public override string ToString() => $"{ID} [{DriverID}]: {Name}, Properties={Properties?.Length.ToString() ?? "NULL"}";
#endif
    }
}