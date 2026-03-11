"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ResultUser = {
  slug: string;
  name: string | null;
  image: string | null;
};

export default function UserSearch({ recentSearches = [] }: { recentSearches?: ResultUser[] }) {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [results, setResults] = useState<ResultUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = q.trim().toLowerCase();

    if (!query) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.users ?? []);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(t);
  }, [q]);

  function goToUser(slug: string) {
    router.push(`/users/${slug}`);
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a username…"
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="button"
          onClick={() => {
            const query = q.trim().toLowerCase();
            if (query) goToUser(query);
          }}
          className="rounded bg-black px-4 py-2 text-white hover:bg-black/50 cursor-pointer"
        >
          {loading ? "…" : "Go"}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {results.length > 0 && (
        <div className="mt-2 overflow-hidden rounded border">
          {results.map((u) => (
            <button
              key={u.slug}
              type="button"
              onClick={() => goToUser(u.slug)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-black/5"
            >
              <div className="flex flex-col">
                <span className="font-medium">{u.name ?? u.slug}</span>
                <span className="text-sm text-white/60">/users/{u.slug}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recently searched */}
      {q.trim() === "" && recentSearches.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-white/50 uppercase tracking-wide">
            Recently Searched
          </h2>
          <div className="overflow-hidden rounded border">
            {recentSearches.map((u) => (
              <button
                key={u.slug}
                type="button"
                onClick={() => goToUser(u.slug)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-black/5"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{u.name ?? u.slug}</span>
                  <span className="text-sm text-white/60">/users/{u.slug}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
