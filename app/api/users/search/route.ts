import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  // 1) Read the query string: /api/users/search?q=...
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  // 2) If empty query, return nothing
  if (!q) {
    return Response.json({ users: [] });
  }

  // 3) Query the DB for matching slugs
  const users = await prisma.user.findMany({
    where: {
      slug: { startsWith: q },
    },
    select: {
      slug: true,
      name: true,
      image: true,
    },
    take: 8,
  });

  // Return JSON
  return Response.json({ users });
}