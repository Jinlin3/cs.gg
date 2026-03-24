import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireUser, recordRecentSearch } from "@/actions/actions";
import EntryForm from "@/components/entry-form";
import CommitGrid from "@/components/commit-grid";
import Link from "next/link";
import { calculateMetrics } from "@/lib/metrics";
import MetricsPieChart from "@/components/metrics-pie-chart";

const PAGE_SIZE = 5; // Number of entries to show per page
const RECENT_DAYS = 20; // Number of recent days to consider for performance metrics

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {

  // SEARCHED USER FROM SLUG
  const { slug } = await params;
  const sp = (await searchParams) ?? {};

  /*
    PAGINATION CHECKS
    1. Math.max with 1 to ensure page is never less than 1
    2. sp.page ?? "1" to default to page 1 if no page query param is provided
    3. || 1 to handle non-numeric page query params, which would result in NaN from parseInt. This way, if parseInt fails, it will default to 1.
  */
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  // Get searched user
  const searchedUser = await prisma.user.findUnique({
    where: { slug },
  });
  if (!searchedUser) notFound();

  // Get searched user's goals
  const goals = await prisma.goals.findUnique({
    where: { userId: searchedUser.id },
  });
  if (!goals) notFound();

  // Total count for pagination
  const total = await prisma.entry.count({
    where: { userId: searchedUser.id },
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  // Get searched user's entries (paginated)
  const entries = await prisma.entry.findMany({
    where: { userId: searchedUser.id },
    orderBy: { date: "desc" },
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // Get all entries for the commit grid
  const allEntries = await prisma.entry.findMany({
    where: { userId: searchedUser.id },
  });

  // PERFORMANCE METRIC LOGIC
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (RECENT_DAYS - 1));

  const recentEntries = await prisma.entry.findMany({
    where: {
      userId: searchedUser.id,
      date: { gte: startDate },
    },
    orderBy: { date: "desc" },
  });

  const metrics = calculateMetrics(recentEntries, goals, RECENT_DAYS);

  // Records the search if user is signed in.
  const signedInUser = await requireUser();
  if (signedInUser) {
    await recordRecentSearch(signedInUser.id, searchedUser.id);
  }

  return (
    <section className="flex flex-col items-center gap-y-4 pt-10 text-center">
      <h1 className="font-semibold text-4xl pb-5">{slug}</h1>
      {signedInUser && signedInUser.slug === searchedUser.slug && (
        <div className="w-full max-w-2xl">
          <EntryForm goals={goals} />
        </div>
      )}

      {/* Metrics Bar */}
      <div className="w-full max-w-2xl border rounded-lg border-white/50 flex flex-col md:flex-row md:items-center text-white/70">
        <div className="flex flex-col text-sm gap-y-2 flex-1 py-6">
          <span className="font-semibold">Last 20 Days Performance</span>
          <span>All Goals Met: {metrics.allGoalsMet} Days</span>
          <span>Some Goals Met: {metrics.someGoalsMet} Days</span>
          <span>No Goals Met: {metrics.noGoalsMet} Days</span>
        </div>
        <div className="flex-1 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/20 py-2">
          <MetricsPieChart metrics={metrics} />
        </div>
      </div>

      {/* GitHub Style Commit Grid */}
      <div className="sm:hidden w-full max-w-2xl">
        <CommitGrid entries={allEntries} goals={goals} days={125} />
      </div>
      <div className="hidden sm:block md:hidden w-full max-w-2xl">
        <CommitGrid entries={allEntries} goals={goals} days={223} />
      </div>
      <div className="hidden md:block w-full max-w-2xl">
        <CommitGrid entries={allEntries} goals={goals} days={272} />
      </div>

      {total > 0 ? (
        <div className="mb-10 w-full max-w-2xl">
          
          {/* Pagination controls */}
          <div className="flex items-center justify-between mb-3">
            <Link
              className={`px-3 py-1 rounded border ${
                safePage <= 1 ? "pointer-events-none opacity-40" : ""
              }`}
              href={`/users/${slug}?page=${safePage - 1}`}
            >
              Prev
            </Link>

            <div className="text-sm opacity-80">
              Page {safePage} of {totalPages} • {total} total
            </div>

            <Link
              className={`px-3 py-1 rounded border ${
                safePage >= totalPages ? "pointer-events-none opacity-40" : ""
              }`}
              href={`/users/${slug}?page=${safePage + 1}`}
            >
              Next
            </Link>
          </div>

          <div className="flex flex-col divide-y space-y-2 divide-black/10">
            {entries.map((entry) => {
              const checks = [
                { value: entry.applications, goal: goals.applications },
                { value: entry.leetcode, goal: goals.leetcode },
                { value: entry.projectHours, goal: goals.projectHours },
              ].filter((c) => c.goal > 0);

              let bgClass = "bg-red-400";
              if (checks.length === 0) bgClass = "bg-neutral-200";
              else {
                const hitCount = checks.filter((c) => c.value >= c.goal).length;
                if (hitCount === checks.length) bgClass = "bg-blue-400";
                else if (hitCount > 0) bgClass = "bg-green-300";
              }

              return (
                <div
                  key={entry.id}
                  className={`flex flex-col py-2 gap-y-1 px-4 rounded-md text-black ${bgClass}`}
                >
                  <span className="italic font-semibold">
                    Date: {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span>Job Applications: {entry.applications}</span>
                  <span>Leetcode Problems: {entry.leetcode}</span>
                  <span>Project Hours: {entry.projectHours}</span>
                </div>
              );
            })}
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-blue-400" /> All goals met
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-green-300" /> Partial
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-red-400" /> No goals met
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-lg italic">No commits found.</div>
      )}
    </section>
  )
}