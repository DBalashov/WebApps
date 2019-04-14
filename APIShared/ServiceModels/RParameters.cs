using System;

namespace AutoGRAPHService
{
    public class RParameters
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public RParameter[] FinalParams { get; set; }
        public RParameter[] OnlineParams { get; set; }
        public RParameter[] TripsParams { get; set; }

#if DEBUG
        public override string ToString() => $"{ID} [{Name}]: FinalParams={FinalParams?.Length.ToString() ?? "NULL"}, OnlineParams={OnlineParams?.Length.ToString() ?? "NULL"}";
#endif
    }

    public class RBaseParameterValue
    {
        public string Name { get; set; }
        public string Caption { get; set; }
        public string Alias { get; set; }
        public ReturnType ReturnType { get; set; }
        public AddValueType ValueType { get; set; }
        public string Unit { get; set; }
        public string Format { get; set; }
        public RParameterStatus[] Statuses { get; set; }

#if DEBUG
        public override string ToString() => $"{Name} [{ReturnType}]: ({Alias}) {Caption}, Unit={Unit}, Statuses={Statuses?.Length.ToString() ?? ""}";
#endif
    }

    public class RParameter : RBaseParameterValue
    {
        public string GroupName { get; set; }        
    }

    public class RParameterStatus
    {
        public int Value { get; set; }
        public string Caption { get; set; }
        public Guid ReferenceID { get; set; }
        public Guid[] ReferenceIDs { get; set; }

#if DEBUG
        public override string ToString() => $"{Value}: {Caption}";
#endif
    }
    
    public enum ReturnType : int
    {
        /// <summary> 0 </summary>
        Boolean = 0,

        /// <summary> 1 </summary>
        Byte = 1,

        /// <summary> 2 </summary>
        Int32 = 2,

        /// <summary> 3 </summary>
        Int64 = 3,

        /// <summary> 4 </summary>
        Double = 4,

        /// <summary> 5 </summary>
        DateTime = 5,

        /// <summary> 6 </summary>
        TimeSpan = 6,

        /// <summary> 7 </summary>
        Guid = 7,

        /// <summary> 8 </summary>
        Guid4 = 8,

        /// <summary> 9 </summary>
        String = 9,
        
        /// <summary> 10, for DataTable only </summary>
        Image = 10,
        
        /// <summary> 11  </summary>
        Coordinates = 11,

        /// <summary> 12 </summary>
        Location = 12
    }

    public enum AddValueType : int
    {
        /// <summary> 0 </summary>
        Curr = 0,

        /// <summary> 1 </summary>
        First = 1,

        /// <summary> 2 </summary>
        Last = 2,

        /// <summary> 3 </summary>
        Diff = 3
    }
}