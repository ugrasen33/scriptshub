type Props = {
  games: string[];
  functionalities: string[];
  selectedGame: string;
  selectedFunc: string;
  mobileOnly: boolean;
  keysystem: string;
  onChange: (next: {
    game: string;
    func: string;
    mobileOnly: boolean;
    keysystem: string;
    query: string;
  }) => void;
};

export default function FilterBar({
  games,
  functionalities,
  selectedGame,
  selectedFunc,
  mobileOnly,
  keysystem,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-col">
        <label className="text-xs">Game</label>
        <select
          value={selectedGame}
          onChange={(e) => onChange({ game: e.target.value, func: selectedFunc, mobileOnly, keysystem, query: "" })}
          className="h-9 rounded-md border px-2"
        >
          <option value="">All</option>
          {games.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs">Functionality</label>
        <select
          value={selectedFunc}
          onChange={(e) => onChange({ game: selectedGame, func: e.target.value, mobileOnly, keysystem, query: "" })}
          className="h-9 rounded-md border px-2"
        >
          <option value="">All</option>
          {functionalities.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs">Keysystem</label>
        <select
          value={keysystem}
          onChange={(e) => onChange({ game: selectedGame, func: selectedFunc, mobileOnly, keysystem: e.target.value, query: "" })}
          className="h-9 rounded-md border px-2"
        >
          <option value="">Any</option>
          <option value="none">None</option>
          <option value="linkvertise">Linkvertise</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={mobileOnly}
          onChange={(e) => onChange({ game: selectedGame, func: selectedFunc, mobileOnly: e.target.checked, keysystem, query: "" })}
        />
        <span className="text-sm">Mobile-friendly</span>
      </div>
      <div className="flex-1" />
      <input
        placeholder="Search"
        className="h-9 w-full rounded-md border px-3 sm:w-64"
        onChange={(e) => onChange({ game: selectedGame, func: selectedFunc, mobileOnly, keysystem, query: e.target.value })}
      />
    </div>
  );
}
