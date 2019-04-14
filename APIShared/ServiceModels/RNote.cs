using System;
using System.Collections.Generic;

namespace AutoGRAPHService
{
    public class RNote
    {
        public Guid UID { get; set; }
        
        public DateTime SD { get; set; }
        public DateTime ED { get; set; }

        public string Stage { get; set; }
        public string StageCaption { get; set; }
        public int State { get; set; }
        public RPoint Point { get; set; }
        public int Severity { get; set; }
        public string Comment { get; set; }
        public string Image { get; set; }

#if DEBUG
        public override string ToString() => $"{UID}: {Stage} ({StageCaption}): {SD.ToString("dd.MM.yyyy HH:mm:ss")} {Comment}";
#endif
    }

    public class RNote1C
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public RNote[] Items { get; set; }
    }
}