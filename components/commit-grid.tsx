import type { Entry, Goals } from "@prisma/client";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Returns the correct color of the box given an entry.
function getColor(entry: Entry | undefined, goals: Goals): string {
  if (!entry) return "bg-neutral-200";

  const checks = [
    { value: entry.applications, goal: goals.applications },
    { value: entry.leetcode, goal: goals.leetcode },
    { value: entry.projectHours, goal: goals.projectHours },
  ].filter((c) => c.goal > 0);

  if (checks.length === 0) return "bg-neutral-200";
  const hit = checks.filter((c) => c.value >= c.goal).length;
  if (hit === checks.length) return "bg-blue-400";
  if (hit > 0) return "bg-green-300";
  return "bg-red-400";
}

// CommitGrid component
export default function CommitGrid({ entries, goals, days = 364 }: { entries: Entry[]; goals: Goals; days?: number }) {
  const entryMap = new Map(
    entries.map((e) => [new Date(e.date).toISOString().slice(0, 10), e])
  );

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Start from the Sunday that is at least `days` days ago
  const start = new Date(today);
  start.setUTCDate(today.getUTCDate() - (days - 1) - today.getUTCDay());

  // Build weeks array
  const weeks: Date[][] = [];
  const cur = new Date(start);
  while (cur <= today) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    weeks.push(week);
  }

  // Find which column each month label should appear in
  const monthLabels = new Map<number, string>();
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const m = week[0].getUTCMonth();
    if (m !== lastMonth) {
      monthLabels.set(i, MONTHS[m]);
      lastMonth = m;
    }
  });

  return (
    <div className="py-4 px-10 border rounded-lg border-white/50">
      <div className="flex flex-col items-center">
        <div className="inline-flex gap-[3px]">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-[3px] mr-1 pt-4">
            {DAY_LABELS.map((day, i) => (
              <div
                key={day}
                className={`h-3 text-[9px] text-gray-500 leading-3 text-right pr-1 ${i % 2 === 0 ? "invisible" : ""}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {/* Month label */}
              <div className="h-3 relative">
                {monthLabels.has(wi) && (
                  <span className="absolute left-0 text-[9px] text-gray-500 whitespace-nowrap leading-3">
                    {monthLabels.get(wi)}
                  </span>
                )}
              </div>

              {/* Day squares */}
              {week.map((date, di) => {
                const isFuture = date > today;
                if (isFuture) return <div key={di} className="w-3 h-3" />;
                const key = date.toISOString().slice(0, 10);
                const entry = entryMap.get(key);
                return (
                  <div
                    key={di}
                    className={`w-3 h-3 rounded-sm ${getColor(entry, goals)}`}
                    title={
                      entry
                        ? `${key} — Apps: ${entry.applications}, LC: ${entry.leetcode}, Proj: ${entry.projectHours}`
                        : `${key} — no entry`
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
