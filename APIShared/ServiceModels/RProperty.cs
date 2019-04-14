using System;
using System.Collections.Generic;
using System.Linq;

namespace AutoGRAPHService
{
    public class RProperties
    {
        public Guid ID { get; set; }
        public string Name { get; set; } 

        public Dictionary<string, object> Properties { get; set; }
        public Dictionary<string, RPropType> PropertyTypes { get; set; }

#if DEBUG
        public override string ToString() => $"{ID}: {Name}, Props={(Properties?.Count().ToString() ?? "NULL")}";
#endif
    }

    public class RProperties1C
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public RProperty[] Properties { get; set; }       

        public RProperties1C() {  }

        public RProperties1C(RProperties from)
        {
            ID = from.ID;
            Name = from.Name;

            Properties = from.Properties.Select(p => new RProperty()
            {
                Name = p.Key,
                Value = p.Value,
                Type = from.PropertyTypes[p.Key]
            }).ToArray();
        }

#if DEBUG
        public override string ToString() => $"{ID}: {Name}, Props={(Properties?.Count().ToString() ?? "NULL")}";
#endif
    }

    public class RPropertyItem1C
    {
        public Guid ID { get; set; }
        public object Value { get; set; }
    }

    public class RProperty
    {
        public bool Inherited { get; set; }
        public RPropType Type { get; set; }
        public string Name { get; set; }
        public object Value { get; set; }

#if DEBUG
        public override string ToString() => $"{Name}: {Type} = {(Value != null ? "(" + Value.GetType().Name + ") " : "")}, {Value?.ToString() ?? "NULL"}";
#endif
    }
   
    public class RPropertyTareTable
    {
        public RTareTableApproximation Approximation { get; set; }
        public bool DependsOnSupply { get; set; }
        public RPropertyTareTableItem[] Items { get; set; }
    }

    public class RPropertyTareTableItem
    {
        public double? Input { get; set; }
        public double? Output { get; set; }
        public double? Supply { get; set; }
    }

    public enum RTareTableApproximation
    {
        Linear = 0,
        Polynomial = 1
    }

    public enum RPropType:int
    {
        String = 0,
        Number = 1,
        Date = 2,
        TareTable = 3,
        
        Time = 4,
        Memo = 5,
        Color = 6,
        Bool = 7,
        Radio = 8,
        Image = 9,
        File = 10,
        ProgressBar = 11,
        Combobox = 12,
        FileLink = 13, 

        Device = 14,
        GeoFence = 15,
        Driver = 16,
        Implement = 17,
        Task = 18,
        CheckDays = 19
    }
}