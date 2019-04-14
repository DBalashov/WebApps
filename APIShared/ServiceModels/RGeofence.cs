using System;

namespace AutoGRAPHService
{
    public class RGeoFenceBase
    {
        public Guid ID { get; set; }
        public Guid? ParentID { get; set; }
        
        public string Name { get; set; }

        public bool IsPolygon { get; set; }
        public double R { get; set; }
        public double[] Lat { get; set; }
        public double[] Lng { get; set; }
        
        public RGeoFenceHole[] Holes { get; set; }

#if DEBUG
        public override string ToString() => $"{ID}: {(IsPolygon ? "[POLY] " : "")} {Name}, R={R}";
#endif
    }

    public class RGeoFenceHole
    {
        public double[] Lat { get; set; }
        public double[] Lng { get; set; }
    }

    public class RGeoFence : RGeoFenceBase
    {
        public string ImageName { get; set; }
        public int Fill { get; set; }
        public int Line { get; set; }        
    }
}