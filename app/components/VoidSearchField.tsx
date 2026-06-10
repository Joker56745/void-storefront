import {useEffect, useMemo, useRef, useState} from 'react';

import {Input} from '~/components/Input';
import {VoidSearchResultRow} from '~/components/VoidSearchResultRow';
import {searchVoidProducts} from '~/data/void-catalog';

type VoidSearchFieldProps = {
  initialQuery?: string;
  placeholder?: string;
  inputClassName?: string;
  variant?: 'search' | 'minisearch';
  /** Panel layout: in-flow on search page, overlay in header. */
  panelMode?: 'inline' | 'overlay';
  /** Sync ?q= to the address bar without Remix navigation (avoids wiping input). */
  syncUrl?: boolean;
  onQueryChange?: (query: string) => void;
};

export function VoidSearchField({
  initialQuery = '',
  placeholder = 'Shell, hoodie, cargo…',
  inputClassName = 'w-full',
  variant = 'search',
  panelMode = 'inline',
  syncUrl = true,
  onQueryChange,
}: VoidSearchFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [panelOpen, setPanelOpen] = useState(Boolean(initialQuery.trim()));

  const trimmed = query.trim();
  const results = useMemo(
    () => (trimmed ? searchVoidProducts(trimmed) : []),
    [trimmed],
  );

  const showPanel = trimmed.length > 0 && panelOpen;

  const closePanel = () => setPanelOpen(false);

  useEffect(() => {
    if (!panelOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closePanel();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [panelOpen]);

  const handleChange = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
    if (value.trim()) setPanelOpen(true);

    if (!syncUrl || typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const next = value.trim();
    if (next) url.searchParams.set('q', next);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  };

  return (
    <div
      ref={rootRef}
      className={
        panelMode === 'overlay'
          ? 'void-search-field relative w-full'
          : 'void-search-field w-full'
      }
    >
      <Input
        value={query}
        onChange={(event) => handleChange(event.currentTarget.value)}
        onFocus={() => {
          if (trimmed) setPanelOpen(true);
        }}
        name="q"
        placeholder={placeholder}
        type="search"
        variant={variant}
        className={inputClassName}
        autoComplete="off"
        aria-controls="void-search-panel"
        aria-expanded={showPanel}
        aria-autocomplete="list"
      />

      {showPanel && (
        <div
          id="void-search-panel"
          className={
            panelMode === 'overlay'
              ? 'void-search-dropdown void-search-dropdown--overlay absolute top-full z-50 mt-2 border border-primary/[0.12] bg-[#0A0A0A]'
              : 'void-search-dropdown mt-3 border border-primary/[0.12] bg-[#0A0A0A]'
          }
          role="listbox"
          aria-label="Search results"
        >
          {results.length === 0 ? (
            <p
              className="void-search-dropdown-empty px-4 py-5 font-sans text-fine uppercase text-primary/50"
              role="status"
            >
              No pieces found
            </p>
          ) : (
            <ul className="void-search-dropdown-list max-h-[min(24rem,55vh)] overflow-y-auto overscroll-contain">
              {results.map((product) => (
                <li key={product.id} role="option">
                  <VoidSearchResultRow
                    product={product}
                    onSelect={closePanel}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
