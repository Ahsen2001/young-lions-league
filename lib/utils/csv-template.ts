/**
 * Downloadable sample CSV structure helper for team bulk imports.
 */

export const SAMPLE_CSV_CONTENT = `team_name,short_name,registration_number,manager_name,captain_name,phone,email
Oddamavadi Youth FC,OYFC,REG-2025-010,Mohamed Farook,Ahmed Rizwan,+94 77 123 4567,farook@oyfc.lk
Coastal Eagles SC,CESC,REG-2025-011,A. Rameez,S. Naufal,+94 77 345 6789,rameez@coastaleagles.lk
Red Storm Oddamavadi,RSO,REG-2025-012,M. Aslam,F. Nabeel,+94 77 456 7890,aslam@redstorm.lk
Green Falcons United,GFU,REG-2025-013,T. Jamsheed,M. Haris,+94 77 567 8901,jamsheed@falcons.lk
Oddamavadi Under-19 Stars,U19S,REG-2025-014,R. Shafeek,Z. Akram,+94 77 678 9012,shafeek@stars.lk
`;

export function downloadSampleCSVTemplate() {
  const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "young_lions_teams_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
