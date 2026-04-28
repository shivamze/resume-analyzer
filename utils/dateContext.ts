// utils/dateContext.ts

export function getDateContext(): string {
  const now = new Date();

  const today = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }); // → "27 April 2026"

  const currentMonth = now.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  }); // → "April 2026"

  const currentYear = now.getFullYear(); // → 2026

  return `
=== DATE CONTEXT — READ BEFORE ANALYSIS ===

TODAY'S DATE     : ${today}
CURRENT MONTH    : ${currentMonth}
CURRENT YEAR     : ${currentYear}

DATE RULES (Strictly follow):
1. Any experience/internship/achievement BEFORE ${today} = VALID PAST ✅
2. Any experience/internship/achievement AFTER ${today} = INVALID FUTURE ❌
3. Calculate durations ACCURATELY:
   - "Dec 2025 - Jan 2026" = 1 month (NOT 1 year)
   - "Jun 2025 - Dec 2025" = 6 months
   - Count only COMPLETED months
4. Events with year ${currentYear} or earlier = VALID, do NOT flag as future
5. Hackathons, competitions, internships in ${currentYear - 1} or ${currentYear} = VALID PAST ✅
6. NEVER flag a date as future unless it is strictly AFTER ${today}

===========================================
`.trim();
}
