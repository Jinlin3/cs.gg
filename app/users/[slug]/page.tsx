import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireUser } from "@/actions/actions";
import EntryForm from "@/components/entry-form";

export default async function UserPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // SEARCHED USER FROM SLUG
  const { slug } = await params;
  const searchedUser = await prisma.user.findUnique({
    where: { slug },
  });

  // First, check if the searched user exists. If not, show 404.
  if (!searchedUser) {
    notFound();
  }
  
  // Get searched user's entries
  const entries = await prisma.entry.findMany({
    where: { userId: searchedUser.id },
    orderBy: { date: "desc" },
  });
  const entryCount = entries.length;

  // Get the searched user's goals
  const goals = await prisma.goals.findUnique({
    where: { userId: searchedUser.id },
  });
  // Check required for EntryForm component
  if (!goals) {
    notFound();
  }

  // Auth
  const signedInUser = await requireUser();

  return (
    <main className="flex flex-col items-center gap-y-4 pt-10 text-center px-6">

      {signedInUser && signedInUser.slug === searchedUser.slug && (
        <EntryForm goals={goals} />
      )}

      <h1 className="text-3xl font-semibold sm:text-3xl">{slug}'s History</h1>

      {entryCount > 0 ? (
        <div className="mb-10 w-full max-w-2xl">
          <div className="flex flex-col divide-y divide-black/10">
            {entries.map((entry) => {
              const hits = [
                entry.applications >= goals!.applications,
                entry.leetcode >= goals!.leetcode,
                entry.projectHours >= goals!.projectHours,
              ];
              const hitCount = hits.filter(Boolean).length;
              let bgClass = "bg-red-300";
              if (hitCount === hits.length) {
                bgClass = "bg-green-300";
              } else if (hitCount > 0) {
                bgClass = "bg-yellow-200";
              }
            
              return (
                <div key={entry.id} className={`flex flex-col py-2 gap-y-1 px-4 rounded-sm ${bgClass}`}>
                  <span className="italic">Date: {new Date(entry.date).toLocaleDateString()}</span>
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