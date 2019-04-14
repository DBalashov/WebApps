using System;

namespace AutoGRAPHService
{
    public partial class RDataRange
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public int Serial { get; set; }
        public DateTime LastModified { get; set; }
        public RDataRangeItem[] Files { get; set; }
    }

    public partial class RDataRangeItem
    {
        public string File { get; set; }
        public int Length { get; set; }
        public DateTime LastModified { get; set; }
    }
}