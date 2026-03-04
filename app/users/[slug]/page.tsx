import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireUser } from "@/actions/actions";
import EntryForm from "@/components/entry-form";
import Link from "next/link";

const PAGE_SIZE = 5; // Number of entries to show per page

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

  // Get searched user's entries
  const entries = await prisma.entry.findMany({
    where: { userId: searchedUser.id },
    orderBy: { date: "desc" },
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // Auth
  const signedInUser = await requireUser();

  return (
    <main className="flex flex-col items-center gap-y-4 pt-10 text-center px-6">
      {signedInUser && signedInUser.slug === searchedUser.slug && (
        <EntryForm goals={goals} />
      )}

      <h1 className="text-3xl font-semibold sm:text-3xl">{slug}'s History</h1>

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

          <div className="flex flex-col divide-y divide-black/10">
            {entries.map((entry) => {
              const checks = [
                { value: entry.applications, goal: goals.applications },
                { value: entry.leetcode, goal: goals.leetcode },
                { value: entry.projectHours, goal: goals.projectHours },
              ].filter((c) => c.goal > 0);

              let bgClass = "bg-red-300";
              if (checks.length === 0) bgClass = "bg-gray-200";
              else {
                const hitCount = checks.filter((c) => c.value >= c.goal).length;
                if (hitCount === checks.length) bgClass = "bg-green-300";
                else if (hitCount > 0) bgClass = "bg-yellow-200";
              }

              return (
                <div
                  key={entry.id}
                  className={`flex flex-col py-2 gap-y-1 px-4 rounded-sm text-black ${bgClass}`}
                >
                  <span className="italic">
                    Date: {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span>Job Applications: {entry.applications}</span>
                  <span>Leetcode Problems: {entry.leetcode}</span>
                  <span>Project Hours: {entry.projectHours}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-lg italic">No commits found.</div>
      )}
    </main>
  )
}