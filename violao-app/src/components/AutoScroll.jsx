/**
 * AutoScroll.jsx
 * Barra fixa na base da tela com controles de auto-scroll:
 *   Play/Pause, Velocidade +/-, indicador visual.
 *
 * Props:
 *  - isPlaying:    boolean
 *  - speed:        número de 1–10 (pixels por tick)
 *  - onToggle:     () => void
 *  - onSpeedUp:    () => void
 *  - onSpeedDown:  () => void
 *  - onReset:      () => void  (volta ao topo)
 */

import React from 'react';

/* Ícones SVG inline (sem biblioteca) */
const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const IconPause = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6"  y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const IconReset = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default function AutoScroll({
  isPlaying,
  speed,
  onToggle,
  onSpeedUp,
  onSpeedDown,
  onReset,
}) {
  return (
    <div className="scroll-bar">
      <div
        className="flex items-center justify-between gap-3 max-w-3xl mx-auto"
        style={{ flexWrap: 'wrap' }}
      >
        {/* Esquerda: label */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Auto-scroll
          </span>

          {/* Indicador de animação quando tocando */}
          {isPlaying && (
            <div className="flex gap-0.5 items-end" style={{ height: 14 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    borderRadius: 2,
                    background: 'var(--accent)',
                    animation: `soundBar 0.8s ${i * 0.15}s ease-in-out infinite alternate`,
                    height: `${40 + i * 25}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Centro: controles de velocidade */}
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost"
            onClick={onSpeedDown}
            disabled={speed <= 1}
            style={{ padding: '0.35rem 0.7rem', fontSize: '1rem', lineHeight: 1 }}
            aria-label="Diminuir velocidade"
            title="Diminuir velocidade"
          >
            −
          </button>

          {/* Barra visual de velocidade */}
          <div className="flex items-center gap-1" aria-label={`Velocidade ${speed}`}>
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4 + (i < speed ? i * 1.2 : 0),
                  borderRadius: 2,
                  background:
                    i < speed
                      ? `hsla(${38 + i * 3}, 90%, ${55 + i * 2}%, 1)`
                      : 'var(--bg-500)',
                  transition: 'all 0.15s',
                  minHeight: 4,
                }}
              />
            ))}
            <span
              className="font-mono text-xs ml-1"
              style={{ color: 'var(--text-secondary)', minWidth: 16 }}
            >
              {speed}×
            </span>
          </div>

          <button
            className="btn btn-ghost"
            onClick={onSpeedUp}
            disabled={speed >= 10}
            style={{ padding: '0.35rem 0.7rem', fontSize: '1rem', lineHeight: 1 }}
            aria-label="Aumentar velocidade"
            title="Aumentar velocidade"
          >
            +
          </button>
        </div>

        {/* Direita: play/pause + reset */}
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost"
            onClick={onReset}
            title="Voltar ao topo"
            aria-label="Voltar ao topo"
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <IconReset />
          </button>

          <button
            className="btn"
            onClick={onToggle}
            aria-label={isPlaying ? 'Pausar auto-scroll' : 'Iniciar auto-scroll'}
            title={isPlaying ? 'Pausar' : 'Iniciar auto-scroll'}
            style={{
              background: isPlaying ? 'rgba(245,158,11,0.15)' : 'var(--accent)',
              color: isPlaying ? 'var(--accent)' : '#0d0d0f',
              border: isPlaying ? '1px solid rgba(245,158,11,0.4)' : 'none',
              padding: '0.45rem 1rem',
              gap: '0.4rem',
              fontWeight: 600,
              minWidth: 90,
              justifyContent: 'center',
            }}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
            {isPlaying ? 'Pausar' : 'Iniciar'}
          </button>
        </div>
      </div>

      {/* Animação das barrinhas de som */}
      <style>{`
        @keyframes soundBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
