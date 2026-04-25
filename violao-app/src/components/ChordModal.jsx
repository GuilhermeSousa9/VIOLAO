/**
 * ChordModal.jsx
 * Modal que aparece ao clicar em um acorde na cifra.
 * Mostra o diagrama visual do acorde e informações extras.
 *
 * Props:
 *  - chord:   objeto do banco de acordes (ou null para fechar)
 *  - onClose: função chamada ao fechar o modal
 */

import React, { useEffect, useCallback } from 'react';
import ChordDiagram from './ChordDiagram';

export default function ChordModal({ chord, onClose }) {
  // Fechar com Escape
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!chord) return;
    document.addEventListener('keydown', handleKey);
    // Trava scroll do body enquanto modal está aberto
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [chord, handleKey]);

  if (!chord) return null;

  const notFound = chord.__notFound;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        // Fechar ao clicar fora do modal-box
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Acorde ${chord.name}`}
    >
      <div className="modal-box" style={{ maxWidth: 340 }}>
        {/* Cabeçalho */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2
              className="font-display text-2xl font-bold"
              style={{ color: 'var(--accent)' }}
            >
              {chord.name}
            </h2>
            {!notFound && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {chord.label}
              </p>
            )}
          </div>

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '0.3rem 0.7rem', fontSize: '1.1rem', lineHeight: 1 }}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        {notFound ? (
          /* Acorde não encontrado na biblioteca */
          <div
            className="text-center py-8 rounded-xl"
            style={{ background: 'var(--bg-600)' }}
          >
            <div className="text-4xl mb-3">🤔</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Diagrama de{' '}
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                {chord.name}
              </span>{' '}
              ainda não está na biblioteca.
            </p>
            <p className="mt-1" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Você pode adicioná-lo manualmente!
            </p>
          </div>
        ) : (
          <>
            {/* Diagrama SVG */}
            <div
              className="flex justify-center items-center py-3 rounded-xl mb-4"
              style={{ background: 'var(--bg-600)' }}
            >
              <ChordDiagram chord={chord} size="lg" />
            </div>

            {/* Notas do acorde */}
            {chord.notes && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                style={{ background: 'var(--bg-500)', fontSize: '0.8rem' }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Notas:</span>
                <span
                  className="font-mono tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {chord.notes}
                </span>
              </div>
            )}

            {/* Dica de dedilhado */}
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}
            >
              <p className="text-xs mb-2 font-semibold" style={{ color: 'var(--accent)' }}>
                💡 Como tocar
              </p>
              <div className="flex gap-2 flex-wrap">
                {chord.fingers.map((fret, i) => {
                  const labels = ['Mi♭', 'Lá', 'Ré', 'Sol', 'Si', 'Mi♯'];
                  const display =
                    fret === -1 ? 'X' : fret === 0 ? '○' : `${fret}ª casa`;
                  const color =
                    fret === -1
                      ? 'var(--text-muted)'
                      : fret === 0
                      ? 'var(--text-secondary)'
                      : 'var(--accent)';
                  return (
                    <div key={i} className="text-center">
                      <div
                        className="font-mono text-xs"
                        style={{ color, fontWeight: fret > 0 ? '600' : '400' }}
                      >
                        {display}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {labels[i]}
                      </div>
                    </div>
                  );
                })}
              </div>
              {chord.barre && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                  🎸 Barra na {chord.barre.fret}ª casa
                </p>
              )}
            </div>
          </>
        )}

        {/* Rodapé */}
        <p
          className="text-center mt-4 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          Clique fora ou pressione Esc para fechar
        </p>
      </div>
    </div>
  );
}
