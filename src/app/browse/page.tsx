'use client';
import FilterBar from "../components/FilterBar";
import ScriptCard from "../components/ScriptCard";
import { useEffect, useState } from "react";
import type { Script } from "@/app/lib/types";

export default function BrowsePage() {
  const [data, setData] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    game: "",
    func: "",
    mobileOnly: false,
    keysystem: "",
    query: "",
  });

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/scripts");
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    run();
  }, []);

  const games = Array.from(new Set(data.map((m) => m.game)));
  const functionalities = Array.from(new Set(data.flatMap((m) => m.functionality)));
  const filtered = data.filter((m) => {
    const matchesGame = !filters.game || m.game === filters.game;
    const matchesFunc = !filters.func || m.functionality.includes(filters.func);
    const matchesMobile = !filters.mobileOnly || m.mobileFriendly;
    const matchesKeysystem = !filters.keysystem || m.keysystem === filters.keysystem;
    const matchesQuery =
      !filters.query ||
      m.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      m.description.toLowerCase().includes(filters.query.toLowerCase());
    return matchesGame && matchesFunc && matchesMobile && matchesKeysystem && matchesQuery;
  });
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Browse Scripts</h1>
      <div className="mt-4">
        <FilterBar
          games={games}
          functionalities={functionalities}
          selectedGame={filters.game}
          selectedFunc={filters.func}
          mobileOnly={filters.mobileOnly}
          keysystem={filters.keysystem}
          onChange={(next) => setFilters(next)}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading && <div className="text-sm text-zinc-500">Loading...</div>}
        {!loading &&
          filtered.map((s) => (
            <ScriptCard key={s.id} s={s} />
          ))}
        {filtered.length === 0 && <div className="text-sm text-zinc-500">No results</div>}
      </div>
    </div>
  );
}
