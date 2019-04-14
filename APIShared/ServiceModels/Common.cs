using System;
using System.Runtime.CompilerServices;

namespace AutoGRAPHService
{
    public class RGroupItem
    {
        public Guid ID { get; set; }
        public Guid? ParentID { get; set; }
        public string Name { get; set; }

#if DEBUG
        public override string ToString() => $"{ID}: {Name}";
#endif
    }

    public class RPoint
    {
        public double Lat { get; set; }
        public double Lng { get; set; }

        public RPoint() { }        

        public RPoint(double _lat, double _lng)
        {
            Lat = Math.Round(_lat, 8);
            Lng = Math.Round(_lng, 8);
        }

        public override string ToString() => $"{Lat} / {Lng}";
    }

    public static class TypeExtenders
    {
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static object TimeSpanToSeconds(this object o) => o is TimeSpan span ? span.TotalSeconds : o;
    }
}