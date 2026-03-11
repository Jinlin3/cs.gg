import { requireUser } from "@/actions/actions";
import { prisma } from "@/lib/prisma";
import UserSearch from "@/components/user-search";

export default async function UserSearchPage() {
  const viewer = await requireUser();

  const recentSearches: { slug: string; name: string | null; image: string | null }[] = [];

  if (viewer) {
    const recent = await prisma.recentSearch.findMany({
      where: { searcherId: viewer.id },
      orderBy: { searchedAt: "desc" },
      take: 20,
      include: { searched: { select: { slug: true, name: true, image: true } } },
    });
    for (const r of recent) {
      if (r.searched.slug) recentSearches.push(r.searched as typeof recentSearches[number]);
    }
  }

  return (
    <main className="mx-auto max-w-xl pt-10 px-6">
      <h1 className="text-3xl font-semibold">Find a User</h1>
      <UserSearch recentSearches={recentSearches} />
    </main>
  );
}
