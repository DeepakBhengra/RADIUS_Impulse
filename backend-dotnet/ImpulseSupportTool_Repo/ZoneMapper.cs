using System;
using System.Collections.Generic;

namespace OrderManagement.API.Helpers
{
    public static class ZoneMapper
    {
        // ✅ Country code → DB2 schema zone mapping
        private static readonly Dictionary<string, string> CountryZoneMap = new(StringComparer.OrdinalIgnoreCase)
        {
            // Zone 4
            { "HK", "Z4" }, { "EH", "Z4" }, { "TW", "Z4" }, { "YM", "Z4" },
            { "CN", "Z4" }, { "TH", "Z4" }, { "MY", "Z4" }, { "SG", "Z4" },
            { "AU", "Z4" }, { "NZ", "Z4" }, { "AX", "Z4" }, { "IN", "Z4" },
            { "IA", "Z4" }, { "BI", "Z4" }, { "LK", "Z4" },

            // Zone 2
            { "DE", "Z2" }, { "AT", "Z2" }, { "CH", "Z2" }, { "DC", "Z2" },
            { "DK", "Z2" }, { "FI", "Z2" }, { "ES", "Z2" }, { "FR", "Z2" },
            { "SE", "Z2" }, { "HU", "Z2" }, { "UK", "Z2" }, { "NO", "Z2" },
            { "IT", "Z2" }, { "BE", "Z2" }, { "NL", "Z2" }, { "CP", "Z2" },

            // Zone 3
            { "BR", "Z3" }, { "AR", "Z3" }, { "CL", "Z3" }, { "EC", "Z3" },
            { "PE", "Z3" }, { "V7", "Z3" }, { "BP", "Z3" }, { "MX", "Z3" },
            { "FT", "Z3" },

            // Zone 1
            { "MD", "Z1" },
        };

        // ✅ Default zone fallback if country code isn't in the map
        private const string DefaultZone = "Z1";

        public static string GetZone(string countryCode)
        {
            if (string.IsNullOrWhiteSpace(countryCode))
                return DefaultZone;

            if (CountryZoneMap.TryGetValue(countryCode.Trim(), out var zone))
                return zone;

            Console.WriteLine($">>> WARNING: No zone mapping found for CountryCode='{countryCode}'. Falling back to {DefaultZone}.");
            return DefaultZone;
        }
    }
}