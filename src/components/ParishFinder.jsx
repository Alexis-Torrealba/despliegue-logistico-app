import { useId, useMemo, useState } from "react";
import { PARISHES } from "../data/parishes.js";
import { fmt, normalize } from "../utils/format.js";
import ZonePill from "./ZonePill.jsx";

const MAX_RESULTS = 6;

// Se busca por el nombre de la tabla ("S.D.G de Tanaguarenas") y por el del lugar
// ("tanaguarenas", del id del mapa), sin importar acentos ni mayúsculas
const INDEX = PARISHES.map((p) => ({
  parish: p,
  text: normalize(`${p.name} ${p.mapId.replace(/-/g, " ")}`),
}));

// Fijo para que otras partes de la página (el mapa en móvil) puedan llevar al buscador
export const FINDER_INPUT_ID = "buscar-parroquia";

// Buscador principal: la pregunta más común es "¿qué recibió mi parroquia?"
export default function ParishFinder({ onSelect }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    return INDEX.filter((e) => e.text.includes(q))
      .map((e) => e.parish)
      .slice(0, MAX_RESULTS);
  }, [query]);

  const expanded = open && query.trim() !== "";

  const choose = (parish) => {
    onSelect(parish);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!results.length) return;
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + results.length) % results.length);
    } else if (e.key === "Enter" && expanded && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape" && expanded) {
      e.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div
      className="relative mt-6 max-w-[560px]"
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <label htmlFor={FINDER_INPUT_ID} className="mb-2 block text-[14px] font-semibold text-fg">
        Busca tu parroquia
      </label>
      <div className="relative">
        <input
          id={FINDER_INPUT_ID}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={expanded && results.length ? `${id}-opt-${active}` : undefined}
          aria-describedby={`${id}-hint`}
          placeholder="Por ejemplo: Macuto, La Páez, Naiguatá…"
          className="w-full rounded-md border border-line bg-panel px-4 py-3 text-[16px] text-fg outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9d9387] focus:border-caritas-soft focus:shadow-[0_0_0_3px_#d9776a26]"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        {expanded && (
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-label="Parroquias encontradas"
            className="absolute inset-x-0 top-full z-50 m-0 mt-1 origin-top list-none overflow-hidden rounded-md border border-line bg-panel-2 p-1 shadow-[0_18px_40px_-16px_rgba(40,14,8,0.9)] transition-[opacity,scale] duration-150 ease-out starting:scale-[0.97] starting:opacity-0"
            data-motion
          >
            {results.length === 0 ? (
              <li className="px-3 py-2.5 text-[14px] text-fg-dim">
                Ninguna parroquia coincide con «{query.trim()}».
              </li>
            ) : (
              results.map((p, i) => (
                <li
                  key={p.mapId}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-[4px] px-3 py-2.5 text-[14px] ${
                    i === active ? "bg-bg-alt text-fg" : "text-fg"
                  }`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    // mousedown y no click: así el input no pierde el foco antes de elegir
                    e.preventDefault();
                    choose(p);
                  }}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{p.name}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2.5">
                    <span className="text-[13px] text-fg-dim tabular-nums">{fmt(p.tons)} t</span>
                    <span className="narrow:hidden">
                      <ZonePill zone={p.zone} />
                    </span>
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <p id={`${id}-hint`} className="mt-1.5 mb-0 text-[12.5px] text-fg-dim">
        Muestra toneladas, vehículos, presbítero y dirección de la parroquia.
      </p>
    </div>
  );
}
