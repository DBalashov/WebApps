using System;

namespace AutoGRAPHService
{
    public class RReportScheduleItem
    {
        public Guid ID { get; set; }
        public string[] Reports { get; set; }
        public bool SplitToTrips { get; set; }
        public RSchedulePeriodType PeriodType { get; set; }
        public TimeSpan From { get; set; }
        public TimeSpan To { get; set; }
        public RScheduleOutFormat OutFormat { get; set; }
        public bool PackToZip { get; set; }
        public string PackToZipPassword { get; set; }

        public DateTime StartFrom { get; set; }
        public Guid[] TargetUsers { get; set; }
        public string[] TargetMails { get; set; }
        public bool SaveToDB { get; set; }
        public DateTime? ValidUntil { get; set; }
        public string MailSubject { get; set; }
        public bool State { get; set; }
    }

    public enum RScheduleOutFormat : int
    {
        HTML = 0,
        PDF = 1,
        Excel2007 = 2,
        Word2007 = 3,
        RTF = 4,
        XPS = 5,

        /// <summary> OpenDocument sheet </summary>
        ODS = 6,

        /// <summary> OpenDocument text </summary>
        ODT = 7
    }

    //public eum
    public enum RSchedulePeriodType : int
    {
        UserDefined = 0,

        SinceStartHour = 7,
        SinceStartDay = 1,
        SinceStartWeek = 2,
        SinceStartMonth = 3,

        LastHour = 8,
        LastDay = 4,
        LastWeek = 5,
        LastMonth = 6,

        PrevHour = 9,
        PrevDay = 10,
        PrevWeek = 11,
        PrevMonth = 12
    }
}