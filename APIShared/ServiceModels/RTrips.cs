using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using JetBrains.Annotations;

namespace AutoGRAPHService
{
    public class RTripTableValues : RBaseParameterValue
    {
        public object[] Values { get; set; }

#if DEBUG
        public override string ToString() => $"{Name} ({Caption}): Values={Values.Length}";
#endif
    }

    public class RTripSummary
    {
        public RTripStage[] Stages { get; set; }
        public Dictionary<string, object> Total { get; set; }
    }

    public class RTripSummary1C
    {
        public RTripStage1C[] Stages { get; set; }
        public RObjectValue1C[] Total { get; set; }
    }

    public class RTrip
    {
        public int Index { get; set; }
        public object SD { get; set; }
        public object ED { get; set; }
        public RPoint PointStart { get; set; }
        public RPoint PointEnd { get; set; }

        public RTripStage[] Stages { get; set; }

        public Dictionary<string, object> Total { get; set; }
        public RTripArea[] Areas { get; set; }

        /// <summary> UTC </summary>
        public DateTime _SD;

        /// <summary> UTC </summary>
        public DateTime _ED;

        public RTrip() { }
        public RTrip(RTrip from, RTripStage[] newStages, Dictionary<string, object> newTotal)
        {
            Index = from.Index;
            SD = from.SD;
            ED = from.ED;
            PointStart = from.PointStart;
            PointEnd = from.PointEnd;

            _SD = from._SD;
            _ED = from._ED;

            Stages = newStages;
            Total = newTotal;
            Areas = from.Areas;
        }
        
#if DEBUG
        public override string ToString() => $"{Index}: {SD}  -  {ED}, Stages={Stages.Length}";
#endif
    }

    public class RTrip1C
    {
        public int Index { get; set; }
        public object SD { get; set; }
        public object ED { get; set; }
        public RPoint PointStart { get; set; }
        public RPoint PointEnd { get; set; }

        public RTripStage1C[] Stages { get; set; }
        public RObjectValue1C[] Total { get; set; }

        public RTripArea[] Areas { get; set; }
        
        public DateTime _SD;
        public DateTime _ED;

        public RTrip1C() {  }
        public RTrip1C(Guid id, RTrip from)
        {
            Index = from.Index;
            SD = from.SD;
            ED = from.ED;
            _SD = from._SD;
            _ED = from._ED;
            PointStart = from.PointStart;
            PointEnd = from.PointEnd;
            Stages = from.Stages?.Select(p => new RTripStage1C(id, p)).ToArray();
            Total = from.Total?.Select(p => new RObjectValue1C(p.Key, p.Value)).ToArray();
            Areas = from.Areas;
        }

#if DEBUG
        public override string ToString() => $"{Index}: {SD}  -  {ED}, Stages={Stages.Length}";
#endif
    }

    public class RTripArea
    {
        public byte ColorR { get; set; }
        public byte ColorG { get; set; }
        public byte ColorB { get; set; }
        public double[][][] Polygons { get; set; }
    }

    public class RTripsSummary
    {
        public Dictionary<string, object> Total { get; set; }
    }

    public class RTripsSummary1C
    {
        public RObjectValue1C[] Total { get; set; }
    }

    public class RTrips
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public int Serial { get; set; }
        public string VRN { get; set; }
        public DateTime SD { get; set; }
        public DateTime ED { get; set; }
        public RTrip[] Trips { get; set; }
        public Dictionary<string, object> Total { get; set; }

        public RPoint LastPosition { get; set; }
        
        public object LastCoords { get; set; }
        public DateTime? _LastCoords;
        
        public object LastData { get; set; }
        public DateTime? _LastData;

        public TimeSpan processingTime;

        public RTrips() { }
        public RTrips([NotNull] RTrips from, [NotNull] RTrip[] newTrips, Dictionary<string, object> newTotal)
        {
            ID = from.ID;
            Name = from.Name;
            VRN = from.VRN;
            SD = from.SD;
            ED = from.ED;
            Serial = from.Serial;
            LastPosition = from.LastPosition;
            LastCoords = from.LastCoords;
            _LastCoords = from._LastCoords;            
            LastData = from.LastData;
            _LastData = from._LastData;
            
            processingTime = from.processingTime;
            
            Trips = newTrips;
            Total = newTotal;
        }
        
#if DEBUG  
        public override string ToString() => $"Trips={Trips.Length}, Total={Total.Count}";
#endif
    }

    public class RTripRequest
    {
        public Guid ID { get; set; }

        /// local time
        public DateTime SD { get; set; }

        /// local time
        public DateTime ED { get; set; }

        /// -1 if no splitting by trips (will return always 1 total trip). 0 or more - index of trip splitter
        public int tripSplitterIndex { get; set; }

        /// true, if no stage items (only total values)
        public bool onlyTotal { get; set; }

        /// if null - no area fields calculation. if !=null - must be contain ID of geofences for fields calculation
        public Guid[] areaIDs { get; set; }

        public Guid[] geofenceIDs { get; set; }

        /// <summary> if mobile checkpoints query </summary>
        public bool IsMain;
    }

    public class RTrips1C
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public int Serial { get; set; }
        public string VRN { get; set; }

        public RTrip1C[] Trips { get; set; }
        public RObjectValue1C[] Total { get; set; }

        public RPoint LastPosition { get; set; }
        
        public object LastCoords { get; set; }
        public DateTime? _LastCoords;
        
        public object LastData { get; set; }
        public DateTime? _LastData;

        public RTrips1C() { }

        public RTrips1C([NotNull] RTrips from)
        {
            ID = from.ID;
            Name = from.Name;
            Serial = from.Serial;
            VRN = from.VRN;
            Trips = from.Trips?.Select(p => new RTrip1C(from.ID, p)).ToArray();
            Total = from.Total?.Select(p => new RObjectValue1C(p.Key, p.Value)).ToArray();

            LastPosition = from.LastPosition;
            
            LastCoords = from.LastCoords;
            _LastCoords = from._LastCoords;
            
            LastData = from.LastData;
            _LastData = from._LastData;
        }

#if DEBUG
        public override string ToString() => $"Trips={Trips.Length}, Total={Total.Length}";
#endif
    }

    public class RTripStage
    {
        public string Name { get; set; }
        public string Alias { get; set; }
        public string[] Params { get; set; }
        public ReturnType[] ParamTypes { get; set; }
        public TotalValueType[] TotalTypes { get; set; }
        public RTripStageItem[] Items { get; set; }
        public RParameterStatus[] Statuses { get; set; }
        public Dictionary<string, object> Total { get; set; }

        public RTripStage() { }
        
        public RTripStage([NotNull] RTripStage from,
            [CanBeNull] string[] newParams, [CanBeNull] ReturnType[] newParamTypes, [CanBeNull] RTripStageItem[] newItems, [CanBeNull] TotalValueType[] newTotalTypes, 
            [CanBeNull] Dictionary<string, object> newTotal)
        {
            Name = from.Name;
            Alias = from.Alias;
            Params = newParams?.ToArray();
            ParamTypes = newParamTypes?.ToArray();
            TotalTypes = newTotalTypes?.ToArray();
            Items = newItems?.ToArray();
            Statuses = from.Statuses;
            Total = newTotal;
        }
        
#if DEBUG
        public override string ToString() => $"{Name} [{Alias}]: Params={Params.Length}, Items={Items.Length}, Statuses={(Statuses?.Length.ToString() ?? "null")}";
#endif
    }

    public class RTripStage1C
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Alias { get; set; }
        public string[] Params { get; set; }
        public ReturnType[] ParamTypes { get; set; }
        public RTripStageItem[] Items { get; set; }
        public RParameterStatus[] Statuses { get; set; }
        public RObjectValue1C[] Total { get; set; }

        public RTripStage1C() { }

        public RTripStage1C(Guid id, [NotNull] RTripStage from)
        {
            ID = id;
            Name = from.Name;
            Alias = from.Alias;
            Params = from.Params;
            ParamTypes = from.ParamTypes;
            foreach (var it in from.Items)
                if(it.Values!=null)
                    for (var i = 0; i < it.Values.Length; i++)
                        it.Values[i] = it.Values[i].TimeSpanToSeconds();
            Items = from.Items;
            Statuses = from.Statuses;
            Total = from.Total?.Select(p => new RObjectValue1C(p.Key, p.Value.TimeSpanToSeconds())).ToArray();
        }
        
#if DEBUG
        public override string ToString() => $"{Name} [{Alias}]: Params={Params.Length}, Items={Items.Length}, Statuses={(Statuses?.Length.ToString() ?? "null")}";
#endif
    }

    public class RObjectValue1C
    {
        public string Name { get; set; }
        public object Value { get; set; }

        public RObjectValue1C() {  }

        public RObjectValue1C(string name, object value)
        {
            Name = name;
            Value = value?.TimeSpanToSeconds();
        }
    }

    public class RTripStageItem
    {
        public int Index { get; set; }
        public object SD { get; set; }
        public object ED { get; set; }

        public int Status { get; set; }
        public Guid StatusID { get; set; }
        public Guid[] StatusIDs { get; set; }

        public RPoint StartPoint { get; set; }
        public RPoint EndPoint { get; set; }

        public string Caption { get; set; }
        public object[] Values { get; set; }

        /// <summary> UTC </summary>
        public DateTime _SD;

        /// <summary> UTC </summary>
        public DateTime _ED;
        
        public RTripStageItem() { }

        public RTripStageItem([NotNull] RTripStageItem from, [CanBeNull] object[] newValues)
        {
            Index = from.Index;
            SD = from.SD;
            ED = from.ED;
            Status = from.Status;
            StatusID = from.StatusID;
            StatusIDs = from.StatusIDs;

            StartPoint = from.StartPoint;
            EndPoint = from.EndPoint;
            Caption = from.Caption;

            _SD = from._SD;
            _ED = from._ED;

            Values = newValues;            
        }

#if DEBUG
        public override string ToString() => $"{Index}: {SD}  -  {ED}, Caption={Caption}, Status={Status}, Values={Values.Length}";
#endif
    }
    
    public enum TotalValueType : int
    {
        /// <summary> 0 </summary>
        None = 0,

        /// <summary> 1 </summary>
        Sum = 1,

        /// <summary> 2 </summary>
        Min = 2,

        /// <summary> 3 </summary>
        Max = 3,

        /// <summary> 4 </summary>
        Mean = 4,

        /// <summary> 5 </summary>
        First = 5,

        /// <summary> 6 </summary>
        Last = 6
    }
}