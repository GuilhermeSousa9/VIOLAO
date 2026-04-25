/**
 * EditorPage.jsx
 * Página de criação e edição de cifras.
 * Carrega a música do localStorage ou SONGS se songId for fornecido.
 *
 * Props:
 *  - songId:     string | null  (null = nova música)
 *  - onNavigate: (page, params?) => void
 */

import React, { useState, useEffect } from 'react';
import { SONGS } from '../data/songs';
import Editor from '../components/Editor';

export default function EditorPage({ songId, onNavigate }) {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(!!songId);

  useEffect(() => {
    if (!songId) {
      setSong(null);
      setLoading(false);
      return;
    }

    // Tenta localStorage primeiro, depois banco padrão
    const stored = localStorage.getItem(`song_${songId}`);
    if (stored) {
      try {
        setSong(JSON.parse(stored));
      } catch (_) {
        setSong(SONGS.find((s) => s.id === songId) || null);
      }
    } else {
      setSong(SONGS.find((s) => s.id === songId) || null);
    }
    setLoading(false);
  }, [songId]);

  function handleSave(updatedSong) {
    // Após salvar, navega para a página da música
    onNavigate('song', { songId: updatedSong.id });
  }

  function handleCancel() {
    if (songId) {
      onNavigate('song', { songId });
    } else {
      onNavigate('home');
    }
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '60vh', color: 'var(--text-muted)' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: '3px solid var(--bg-500)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-900)' }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-800)',
          borderBottom: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: 768,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={handleCancel}
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
          >
            ← Voltar
          </button>

          <div>
            <h1
              className="font-display font-bold text-xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {song ? `Editando: ${song.title}` : '✏️  Nova cifra'}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {song
                ? 'Alterações salvas automaticamente no rascunho'
                : 'Cole ou digite a cifra abaixo'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Editor ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 768, margin: '0 auto', padding: '1.5rem' }}>
        {/* Dicas rápidas */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{
            background: 'var(--bg-700)',
            border: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {[
            { icon: '🎸', tip: 'Use [C] para marcar acordes' },
            { icon: '📝', tip: 'Cole cifra e clique Auto-formatar' },
            { icon: '🔖', tip: 'Use ||VERSO|| para seções' },
            { icon: '💾', tip: 'Salvo automaticamente no rascunho' },
          ].map(({ icon, tip }) => (
            <div
              key={tip}
              className="flex items-center gap-2 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>{icon}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>

        <Editor
          song={song}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
