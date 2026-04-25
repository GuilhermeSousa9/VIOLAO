/**
 * Home.jsx
 * Página inicial do ViolãoApp.
 * Exibe saudação, lista de músicas e navegação para as funcionalidades.
 *
 * Props:
 *  - onNavigate: (page, params?) => void
 */

import React, { useState, useEffect } from 'react';
import { SONGS, difficultyLabel, difficultyClass } from '../data/songs';

const USERNAME = 'Guilherme';

/* Hora do dia → saudação */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

/* Ícones */
const IconGuitar  = () => <span style={{ fontSize: '1.3rem' }}>🎸</span>;
const IconBook    = () => <span style={{ fontSize: '1.3rem' }}>📖</span>;
const IconPlus    = () => <span style={{ fontSize: '1.3rem' }}>✏️</span>;
const IconHeart   = () => <span style={{ fontSize: '0.9rem' }}>❤️</span>;
const IconHeartO  = () => <span style={{ fontSize: '0.9rem' }}>🤍</span>;

export default function Home({ onNavigate }) {
  const [songs, setSongs]       = useState(SONGS);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [search, setSearch]     = useState('');

  // Carregar músicas customizadas do localStorage
  useEffect(() => {
    const stored = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('song_')) {
        try {
          const s = JSON.parse(localStorage.getItem(key));
          stored.push(s);
        } catch (_) {}
      }
    }

    // Mesclar com músicas padrão (músicas salvas sobrescrevem as padrão)
    if (stored.length > 0) {
      const merged = [...SONGS];
      stored.forEach((s) => {
        const idx = merged.findIndex((m) => m.id === s.id);
        if (idx >= 0) merged[idx] = s;
        else merged.push(s);
      });
      setSongs(merged);
    }
  }, []);

  // Favoritar/desfavoritar
  function toggleFavorite(song) {
    const updated = songs.map((s) =>
      s.id === song.id ? { ...s, favorite: !s.favorite } : s
    );
    setSongs(updated);

    // Persistir no localStorage
    const key = `song_${song.id}`;
    const existingJSON = localStorage.getItem(key);
    const existing = existingJSON ? JSON.parse(existingJSON) : song;
    localStorage.setItem(
      key,
      JSON.stringify({ ...existing, favorite: !song.favorite })
    );
  }

  // Filtrar músicas
  const visible = songs.filter((s) => {
    if (favoritesOnly && !s.favorite) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalChords = [...new Set(songs.flatMap((s) => s.chords || []))].length;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-900)',
      }}
    >
      {/* ── Hero / Header ──────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg-800) 0%, var(--bg-900) 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '2.5rem 1.5rem 2rem',
        }}
      >
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
          {/* Saudação */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <p
                className="text-sm mb-0.5"
                style={{ color: 'var(--text-muted)' }}
              >
                {getGreeting()},
              </p>
              <h1
                className="font-display text-3xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {USERNAME}{' '}
                <span style={{ color: 'var(--accent)' }}>🎸</span>
              </h1>
            </div>

            {/* Botão novo */}
            <button
              className="btn btn-primary"
              onClick={() => onNavigate('editor')}
              style={{ gap: 6 }}
            >
              <IconPlus /> Nova cifra
            </button>
          </div>

          {/* Estatísticas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            {[
              { label: 'Músicas', value: songs.length, icon: '🎵' },
              { label: 'Acordes', value: totalChords, icon: '🎼' },
              { label: 'Favoritas', value: songs.filter((s) => s.favorite).length, icon: '❤️' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center"
                style={{
                  background: 'var(--bg-700)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>{stat.icon}</div>
                <div
                  className="font-display font-bold text-xl mt-1"
                  style={{ color: 'var(--accent)' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Atalhos de navegação */}
          <div className="flex gap-2 flex-wrap">
            <button
              className="btn btn-ghost"
              onClick={() => onNavigate('library')}
              style={{ fontSize: '0.8rem' }}
            >
              <IconBook /> Biblioteca de acordes
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => onNavigate('editor')}
              style={{ fontSize: '0.8rem' }}
            >
              <IconPlus /> Editor de cifras
            </button>
          </div>
        </div>
      </div>

      {/* ── Lista de músicas ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: 768, margin: '0 auto', padding: '1.5rem' }}>
        {/* Filtros */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <input
            type="text"
            className="input"
            placeholder="🔍  Buscar música ou artista..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />

          <button
            className="btn"
            onClick={() => setFavoritesOnly((v) => !v)}
            style={{
              background: favoritesOnly
                ? 'rgba(239,68,68,0.15)'
                : 'var(--bg-600)',
              color: favoritesOnly ? '#f87171' : 'var(--text-primary)',
              border: favoritesOnly
                ? '1px solid rgba(239,68,68,0.3)'
                : '1px solid var(--border)',
              fontSize: '0.8rem',
            }}
          >
            ❤️ Favoritas
          </button>
        </div>

        {/* Cabeçalho da lista */}
        <div className="flex items-center justify-between mb-3">
          <h2
            className="font-display font-bold text-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            {favoritesOnly ? 'Favoritas' : 'Todas as músicas'}
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {visible.length} música{visible.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Cards de música */}
        {visible.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background: 'var(--bg-800)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <div className="text-5xl mb-4">🎶</div>
            <p>
              {favoritesOnly
                ? 'Nenhuma música favorita ainda.'
                : 'Nenhuma música encontrada.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {visible.map((song) => (
              <div
                key={song.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.15s',
                }}
                onClick={() => onNavigate('song', { songId: song.id })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {/* Ícone */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(245,158,11,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    flexShrink: 0,
                  }}
                >
                  🎵
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-display font-bold"
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {song.title}
                    </span>
                    <span className={`badge ${difficultyClass(song.difficulty)}`}>
                      {difficultyLabel(song.difficulty)}
                    </span>
                  </div>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {song.artist}
                    {song.key && (
                      <span
                        className="ml-2 font-mono text-xs"
                        style={{ color: 'var(--accent)', opacity: 0.8 }}
                      >
                        {song.key}
                        {song.capo > 0 && ` · Capo ${song.capo}`}
                      </span>
                    )}
                  </p>

                  {/* Acordes da música */}
                  {song.chords && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {song.chords.slice(0, 6).map((c) => (
                        <span
                          key={c}
                          className="font-mono"
                          style={{
                            fontSize: '0.65rem',
                            background: 'var(--bg-500)',
                            color: 'var(--text-secondary)',
                            padding: '1px 5px',
                            borderRadius: 4,
                          }}
                        >
                          {c}
                        </span>
                      ))}
                      {song.chords.length > 6 && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          +{song.chords.length - 6}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Favoritar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(song);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.3rem',
                    flexShrink: 0,
                    transition: 'transform 0.15s',
                  }}
                  title={song.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  aria-label={song.favorite ? 'Remover dos favoritos' : 'Favoritar'}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.3)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  {song.favorite ? <IconHeart /> : <IconHeartO />}
                </button>

                {/* Seta */}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
