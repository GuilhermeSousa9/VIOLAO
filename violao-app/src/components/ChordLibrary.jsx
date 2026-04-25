/**
 * ChordLibrary.jsx
 * Exibe a biblioteca completa de acordes com campo de busca.
 * Ao clicar em um acorde, chama onSelectChord para abrir o modal.
 *
 * Props:
 *  - onSelectChord: (chordObj) => void
 *  - filter:        lista de nomes de acordes para filtrar (opcional)
 *                   se fornecida, só mostra esses acordes
 */

import React, { useState, useMemo } from 'react';
import { CHORDS, searchChords } from '../data/chords';
import ChordDiagram from './ChordDiagram';

/* Ícone de busca */
const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function ChordLibrary({ onSelectChord, filter }) {
  const [query, setQuery] = useState('');

  // Filtra por busca e/ou lista de acordes fornecida
  const chords = useMemo(() => {
    let base = query ? searchChords(query) : CHORDS;
    if (filter && filter.length > 0) {
      const filterLower = filter.map((f) => f.toLowerCase());
      base = base.filter((c) => filterLower.includes(c.name.toLowerCase()));
    }
    return base;
  }, [query, filter]);

  // Grupos para exibição (maiores, menores, 7ª, etc.)
  const groups = useMemo(() => {
    if (query || filter) return [{ label: 'Resultados', items: chords }];

    return [
      {
        label: 'Maiores',
        items: chords.filter(
          (c) => !c.name.includes('m') && !c.name.includes('7') && !c.name.includes('sus') && !c.name.includes('add')
        ),
      },
      {
        label: 'Menores',
        items: chords.filter(
          (c) => c.name.includes('m') && !c.name.includes('maj') && !c.name.includes('7')
        ),
      },
      {
        label: 'Com 7ª',
        items: chords.filter((c) => c.name.includes('7')),
      },
      {
        label: 'Sus / Add',
        items: chords.filter(
          (c) => c.name.includes('sus') || c.name.includes('add')
        ),
      },
    ].filter((g) => g.items.length > 0);
  }, [chords, query, filter]);

  return (
    <div>
      {/* Campo de busca */}
      <div className="relative mb-5">
        <span
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        >
          <SearchIcon />
        </span>
        <input
          type="text"
          className="input"
          placeholder="Buscar acorde... (ex: Am, G7, Dsus2)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: '2rem' }}
          aria-label="Buscar acorde"
        />
      </div>

      {/* Lista de acordes agrupada */}
      {groups.length === 0 ? (
        <div
          className="text-center py-10"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="text-3xl mb-2">😕</div>
          <p>Nenhum acorde encontrado para "{query}"</p>
        </div>
      ) : (
        groups.map((group) => (
          <div key={group.label} className="mb-6">
            {/* Cabeçalho do grupo */}
            {!query && !filter && (
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                {group.label}
              </p>
            )}

            {/* Grid de acordes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {group.items.map((chord) => (
                <button
                  key={chord.name}
                  onClick={() => onSelectChord(chord)}
                  className="card"
                  style={{
                    padding: '0.75rem 0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    background: 'var(--bg-800)',
                    transition: 'border-color 0.2s, background 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                  title={chord.label}
                  aria-label={`Abrir diagrama de ${chord.name}`}
                >
                  {/* Mini diagrama */}
                  <ChordDiagram chord={chord} size="sm" />

                  {/* Nome */}
                  <span
                    className="font-display font-bold text-sm"
                    style={{ color: 'var(--accent)' }}
                  >
                    {chord.name}
                  </span>
                  <span
                    style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}
                  >
                    {chord.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
