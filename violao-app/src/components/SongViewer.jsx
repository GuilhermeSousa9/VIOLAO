/**
 * SongViewer.jsx
 * Renderiza a cifra parseada com acordes clicáveis e destaque de linha.
 *
 * Props:
 *  - blocks:          resultado de parseSong() — array de blocos
 *  - onChordClick:    (chordName: string) => void
 *  - highlightLine:   índice da linha atualmente em foco (auto-scroll)
 */

import React, { useRef, useEffect } from 'react';

/* ── Sub-componente: um segmento chord+letra ─────────────────────────────── */
function Segment({ segment, onChordClick }) {
  const { chord, lyric } = segment;

  return (
    <span className="song-segment">
      {/* Linha do acorde */}
      <span className="chord-row">
        {chord ? (
          <span
            className="chord-token"
            onClick={() => onChordClick(chord)}
            title={`Ver acorde ${chord}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onChordClick(chord);
            }}
          >
            {chord}
          </span>
        ) : null}
      </span>

      {/* Linha da letra */}
      <span className="lyric-row">{lyric}</span>
    </span>
  );
}

/* ── Sub-componente: uma linha da música ─────────────────────────────────── */
function SongLine({ block, lineIndex, highlightLine, onChordClick }) {
  const isHighlighted = highlightLine === lineIndex;

  return (
    <div
      className={`song-line ${isHighlighted ? 'line-highlight' : ''}`}
      style={{ marginBottom: '0.1rem' }}
    >
      {block.segments.map((seg, i) => (
        <Segment key={i} segment={seg} onChordClick={onChordClick} />
      ))}
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────────────── */
export default function SongViewer({ blocks, onChordClick, highlightLine }) {
  const containerRef = useRef(null);

  // Scroll automático para linha destacada
  useEffect(() => {
    if (highlightLine == null || !containerRef.current) return;
    const lines = containerRef.current.querySelectorAll('.song-line');
    const target = lines[highlightLine];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightLine]);

  if (!blocks || blocks.length === 0) {
    return (
      <div
        className="text-center py-16"
        style={{ color: 'var(--text-muted)' }}
      >
        <div className="text-5xl mb-4">🎼</div>
        <p>Nenhuma cifra disponível para esta música.</p>
      </div>
    );
  }

  // Índice para linhas renderizáveis (para highlight correto)
  let lineCounter = -1;

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 2.1,
        fontSize: '1rem',
        letterSpacing: '0.01em',
        userSelect: 'text',
      }}
    >
      {blocks.map((block, blockIdx) => {
        /* Linha em branco */
        if (block.type === 'blank') {
          return <div key={blockIdx} style={{ height: '1.2rem' }} />;
        }

        /* Cabeçalho de seção */
        if (block.type === 'section') {
          return (
            <div
              key={blockIdx}
              className="flex items-center gap-3 mt-6 mb-2"
            >
              <div
                style={{
                  width: 3,
                  height: 18,
                  borderRadius: 2,
                  background: 'var(--accent)',
                  flexShrink: 0,
                }}
              />
              <span
                className="font-display text-xs font-bold tracking-widest uppercase"
                style={{ color: 'var(--accent)', opacity: 0.85 }}
              >
                {block.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: 'var(--border)',
                }}
              />
            </div>
          );
        }

        /* Linha de cifra */
        if (block.type === 'line') {
          lineCounter++;
          const currentLine = lineCounter;
          return (
            <SongLine
              key={blockIdx}
              block={block}
              lineIndex={currentLine}
              highlightLine={highlightLine}
              onChordClick={onChordClick}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
