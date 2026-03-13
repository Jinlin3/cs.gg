import type { Entry, Goals } from '@prisma/client';

export function calculateMetrics(
  recentEntries: Entry[],
  goals: Goals,
  RECENT_DAYS: number
) {
  // PERFORMANCE METRIC LOGIC - Calculate how many of the last RECENT_DAYS days met all, some, or none of the goals.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (RECENT_DAYS - 1));

  const entriesByDay: Record<string, Entry | undefined> = {};
  recentEntries.forEach((entry) => {
    const dayKey = new Date(entry.date).toISOString().slice(0, 10);
    entriesByDay[dayKey] = entry; // Since entries are unique per day, assign directly
  });

  const metrics = {
    allGoalsMet: 0,
    someGoalsMet: 0,
    noGoalsMet: 0,
  };

  const getEntryStatus = (entry: Entry) => {
    const checks = [
      { value: entry.applications, goal: goals.applications },
      { value: entry.leetcode, goal: goals.leetcode },
      { value: entry.projectHours, goal: goals.projectHours },
    ].filter((c) => c.goal > 0);

    if (checks.length === 0) return "none" as const;

    const hitCount = checks.filter((c) => c.value >= c.goal).length;
    if (hitCount === checks.length) return "all" as const;
    if (hitCount > 0) return "some" as const;
    return "none" as const;
  };

  for (let i = 0; i < RECENT_DAYS; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const dayKey = day.toISOString().slice(0, 10);

    const entryForDay = entriesByDay[dayKey];
    if (!entryForDay) {
      metrics.noGoalsMet++;
      continue;
    }

    const dayStatus = getEntryStatus(entryForDay);

    if (dayStatus === "all") metrics.allGoalsMet++;
    else if (dayStatus === "some") metrics.someGoalsMet++;
    else metrics.noGoalsMet++;
  }

  return metrics;
}