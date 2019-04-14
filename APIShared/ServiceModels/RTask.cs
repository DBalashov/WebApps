using System;

namespace AutoGRAPHService
{
    public class RTaskInfo
    {
        public Guid? CurrentTaskID { get; set; }
        public DateTime? CurrentTaskStart { get; set; }
        public DateTime? CurrentTaskEnd { get; set; }

        public RTask[] AllTasks { get; set; }

#if DEBUG
        public override string ToString() => $"CurrentTaskID={CurrentTaskID}, {CurrentTaskStart} - {CurrentTaskEnd}, Tasks={AllTasks.Length}";
#endif
    }

    public class RTaskInfo1C: RTaskInfo
    {
        public Guid ID { get; set; }
    }

    public class RTask
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public bool StrictOrder { get; set; }
        public TimeSpan? GeofencesTime { get; set; }
        public RTaskGeofence[] Geofences { get; set; }

#if DEBUG
        public override string ToString() => $"{ID}: {Name} ({StrictOrder}), GFs = {Geofences.Length}";
#endif
    }

    public class RTaskInfoSet
    {
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public RTask Task { get; set; }
    }    

    public class RTaskGeofence
    {
        public Guid ID { get; set; }
        public TimeSpan? ArriveST { get; set; }
        public TimeSpan? ArriveET { get; set; }
        public TimeSpan? DepartureST { get; set; }
        public TimeSpan? DepartureET { get; set; }

#if DEBUG
        public override string ToString() => $"{ID}: {ArriveST} - {ArriveET}, {DepartureST}-{DepartureET}";
#endif
    }
}