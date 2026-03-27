import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Leaderboards() {

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const totals = await prisma.entry.groupBy({
    by: ["userId"],
    where: {
      date: {
        gte: sevenDaysAgo,
      }
    },
    _sum: {
      applications: true,
      leetcode: true,
      projectHours: true,
    },
  });

  const users = await prisma.user.findMany({
    where: { 
      id: { 
        in: totals.map((t) => t.userId) 
      } 
    },
    select: { id: true, slug: true },
  });

  const userMap = Object.fromEntries(users.map((u) => [u.id, u.slug]));

  const groupedMetrics = totals.map((total) => {
    const totalScore = (total._sum.applications || 0) + (total._sum.leetcode || 0) + (total._sum.projectHours || 0);
    return {
      userId: total.userId,
      slug: userMap[total.userId],
      totalScore,
      applications: total._sum.applications || 0,
      leetcode: total._sum.leetcode || 0,
      projectHours: total._sum.projectHours || 0,
    };
  });

  console.log(users);

  return (
    <section className="pt-10 text-center">
      <h1 className="text-2xl md:text-3xl font-semibold mb-8">Top Contributors in the Last 7 Days</h1>
      <div>
        {groupedMetrics.map((metric, index) => (
          <Link key={metric.userId} href={`/users/${metric.slug}`}>
            <div className="flex flex-row items-center mt-4 bg-gray-900 rounded-xl text-white px-8 py-4 text-md md:text-sm lg:text-lg hover:bg-gray-950 transition-colors">
              <div className="flex flex-row items-center justify-center md:justify-start gap-6 w-1/2 md:w-1/3">
                <p className="font-bold">{index + 1}</p>
                <p className="font-bold">{metric.slug}</p>
              </div>
              <div className="flex flex-col md:flex-row items-center w-1/2 md:w-2/3 justify-between">
                <p className="font-semibold">Total Score: {metric.totalScore}</p>
                <p>Applications: {metric.applications}</p>
                <p>Leetcode: {metric.leetcode}</p>
                <p>Project Hours: {metric.projectHours}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}