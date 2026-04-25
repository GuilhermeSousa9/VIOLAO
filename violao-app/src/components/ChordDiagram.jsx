/**
 * ChordDiagram.jsx
 * Renderiza um diagrama visual de acorde (estilo tablatura) usando SVG puro.
 *
 * Props:
 *  - chord: objeto do banco de acordes (name, fingers, barre, label)
 *  - size:  'sm' | 'md' | 'lg'  (padrão: 'md')
 */

import React from 'react';

// Constantes de layout do SVG
const STRINGS  = 6;   // cordas
const FRETS    = 5;   // casas visíveis
const NUT_SIZE = 4;   // espessura da pestana (casa 0)

/**
 * Retorna dimensões conforme o tamanho desejado.
 */
function getDimensions(size) {
  const map = {
    sm: { w: 130, h: 160, pad: 22, r: 6, fontSize: 9  },
    md: { w: 170, h: 200, pad: 28, r: 8, fontSize: 11 },
    lg: { w: 210, h: 245, pad: 34, r: 9, fontSize: 13 },
  };
  return map[size] || map.md;
}

export default function ChordDiagram({ chord, size = 'md' }) {
  if (!chord) return null;

  const { w, h, pad, r, fontSize } = getDimensions(size);

  // Área do diagrama
  const gridLeft   = pad + 12;
  const gridTop    = pad + 16;
  const gridRight  = w - pad;
  const gridBottom = h - pad - 14;
  const gridW      = gridRight - gridLeft;
  const gridH      = gridBottom - gridTop;

  const stringSpacing = gridW / (STRINGS - 1);
  const fretSpacing   = gridH / FRETS;

  // Detecta se há barra e a casa mínima para exibição
  const hasBarre = Boolean(chord.barre);
  const minFret  = Math.min(
    ...chord.fingers.filter((f) => f > 0)
  );
  // Casa de referência para mostrar o número quando não começa na 1ª
  const startFret = minFret > 1 && minFret <= 7 ? minFret : 1;
  const showFretNumber = startFret > 1;

  // Cor do tema
  const ACCENT  = '#f59e0b';
  const FG      = '#f0ede8';
  const GRID    = 'rgba(255,255,255,0.12)';
  const MUTED   = '#ef4444';

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className="chord-svg"
      aria-label={`Diagrama do acorde ${chord.name}`}
    >
      {/* Fundo transparente */}
      <rect width={w} height={h} fill="transparent" />

      {/* Nome do acorde */}
      <text
        x={w / 2}
        y={pad - 2}
        textAnchor="middle"
        fill={ACCENT}
        fontSize={fontSize + 5}
        fontWeight="700"
        fontFamily="Syne, sans-serif"
      >
        {chord.name}
      </text>

      {/* Indicador de casa inicial (quando não começa na 1ª) */}
      {showFretNumber && (
        <text
          x={gridLeft - 14}
          y={gridTop + fretSpacing / 2 + 4}
          textAnchor="middle"
          fill={FG}
          fontSize={fontSize - 1}
          fontFamily="DM Mono, monospace"
        >
          {startFret}ª
        </text>
      )}

      {/* Pestana (fret 0) — só na 1ª posição */}
      {!showFretNumber && (
        <rect
          x={gridLeft - 2}
          y={gridTop}
          width={gridW + 4}
          height={NUT_SIZE}
          rx={2}
          fill={FG}
          opacity={0.8}
        />
      )}

      {/* Linhas das casas (horizontal) */}
      {Array.from({ length: FRETS + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={gridLeft}
          y1={gridTop + i * fretSpacing}
          x2={gridRight}
          y2={gridTop + i * fretSpacing}
          stroke={GRID}
          strokeWidth={i === 0 && !showFretNumber ? 0 : 1}
        />
      ))}

      {/* Linhas das cordas (vertical) */}
      {Array.from({ length: STRINGS }, (_, i) => (
        <line
          key={`str-${i}`}
          x1={gridLeft + i * stringSpacing}
          y1={gridTop}
          x2={gridLeft + i * stringSpacing}
          y2={gridBottom}
          stroke={GRID}
          strokeWidth={1}
        />
      ))}

      {/* Barra */}
      {hasBarre && chord.barre && (() => {
        const { fret, fromString, toString: toStr } = chord.barre;
        const adjustedFret = fret - startFret + 1;
        if (adjustedFret < 1 || adjustedFret > FRETS) return null;
        const barX1 = gridLeft + fromString * stringSpacing;
        const barX2 = gridLeft + toStr    * stringSpacing;
        const barY  = gridTop + (adjustedFret - 0.5) * fretSpacing;
        return (
          <rect
            key="barre"
            x={barX1 - r}
            y={barY - r}
            width={barX2 - barX1 + r * 2}
            height={r * 2}
            rx={r}
            fill={ACCENT}
            opacity={0.85}
          />
        );
      })()}

      {/* Dedos (pontos nas casas) + X/O em cima */}
      {chord.fingers.map((fret, strIdx) => {
        // strIdx 0 = corda 6 (Mi grave, esquerda no diagrama)
        const x = gridLeft + strIdx * stringSpacing;

        if (fret === -1) {
          // Corda muda (X)
          return (
            <text
              key={`mute-${strIdx}`}
              x={x}
              y={gridTop - 6}
              textAnchor="middle"
              fill={MUTED}
              fontSize={fontSize}
              fontWeight="700"
            >
              ×
            </text>
          );
        }

        if (fret === 0) {
          // Corda solta (O)
          return (
            <circle
              key={`open-${strIdx}`}
              cx={x}
              cy={gridTop - 8}
              r={r - 2}
              fill="none"
              stroke={FG}
              strokeWidth={1.5}
            />
          );
        }

        // Casa pressionada
        const adjustedFret = fret - startFret + 1;
        if (adjustedFret < 1 || adjustedFret > FRETS) return null;
        const y = gridTop + (adjustedFret - 0.5) * fretSpacing;

        // Não desenhar ponto se já tem barra nessa posição e corda
        const isBarred =
          hasBarre &&
          chord.barre &&
          fret === chord.barre.fret &&
          strIdx >= chord.barre.fromString &&
          strIdx <= chord.barre.toString;

        if (isBarred) return null;

        return (
          <circle
            key={`dot-${strIdx}`}
            cx={x}
            cy={y}
            r={r}
            fill={ACCENT}
          />
        );
      })}

      {/* Rótulos de cordas na base (opcional) */}
      {['E', 'A', 'D', 'G', 'B', 'e'].map((note, i) => (
        <text
          key={`note-${i}`}
          x={gridLeft + i * stringSpacing}
          y={gridBottom + 13}
          textAnchor="middle"
          fill="rgba(255,255,255,0.25)"
          fontSize={fontSize - 2}
          fontFamily="DM Mono, monospace"
        >
          {note}
        </text>
      ))}
    </svg>
  );
}
