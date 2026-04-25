/**
 * SongPage.jsx
 * Página de uma música específica.
 * Integra: SongViewer, AutoScroll, VideoPlayer, ChordModal, busca na web.
 *
 * Props:
 *  - songId:     string
 *  - onNavigate: (page, params?) => void
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SONGS, difficultyLabel, difficultyClass } from '../data/songs';
import { parseSong }     from '../utils/parser';
import { getChord }      from '../data/chords';
import SongViewer        from '../components/SongViewer';
import AutoScroll        from '../components/AutoScroll';
import VideoPlayer       from '../components/VideoPlayer';
import ChordModal        from '../components/ChordModal';
import ChordLibrary      from '../components/ChordLibrary';

/* Velocidade de scroll: pixels por intervalo (50ms) */
const SPEED_MAP = [0, 0.3, 0.6, 1, 1.5, 2, 2.8, 3.8, 5, 6.5, 8.5];
const TICK_INTERVAL = 50; // ms

export default function SongPage({ songId, onNavigate }) {
  // ── Dados da música ────────────────────────────────────────────────────────
  const [song, setSong] = useState(null);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // Primeiro tenta localStorage (cifra customizada)
    const stored = localStorage.getItem(`song_${songId}`);
    let s = stored ? JSON.parse(stored) : SONGS.find((m) => m.id === songId);
    if (!s) s = SONGS.find((m) => m.id === songId);
    setSong(s || null);
    setBlocks(s ? parseSong(s.tab) : []);
  }, [songId]);

  // ── Tabs da interface ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('cifra'); // 'cifra' | 'video' | 'acordes'

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  const [scrollPlaying, setScrollPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed]     = useState(3);
  const [highlightLine, setHighlightLine] = useState(null);
  const scrollAccum = useRef(0);
  const rafRef      = useRef(null);

  const doScroll = useCallback(() => {
    const px = SPEED_MAP[scrollSpeed] || 1;
    scrollAccum.current += px;
    if (scrollAccum.current >= 1) {
      window.scrollBy({ top: Math.floor(scrollAccum.current) });
      scrollAccum.current -= Math.floor(scrollAccum.current);
    }
    rafRef.current = setTimeout(doScroll, TICK_INTERVAL);
  }, [scrollSpeed]);

  useEffect(() => {
    if (scrollPlaying) {
      rafRef.current = setTimeout(doScroll, TICK_INTERVAL);
    } else {
      clearTimeout(rafRef.current);
    }
    return () => clearTimeout(rafRef.current);
  }, [scrollPlaying, doScroll]);

  function handleScrollReset() {
    setScrollPlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Modal de acorde ────────────────────────────────────────────────────────
  const [modalChord, setModalChord] = useState(null);

  function handleChordClick(chordName) {
    const chord = getChord(chordName);
    if (chord) {
      setModalChord(chord);
    } else {
      // Acorde não encontrado → mostra modal com aviso
      setModalChord({ name: chordName, __notFound: true });
    }
  }

  // ── Favoritar ──────────────────────────────────────────────────────────────
  function toggleFavorite() {
    if (!song) return;
    const updated = { ...song, favorite: !song.favorite };
    setSong(updated);
    localStorage.setItem(`song_${song.id}`, JSON.stringify(updated));
  }

  // ── Busca na web ───────────────────────────────────────────────────────────
  function searchOnWeb() {
    if (!song) return;
    const q = encodeURIComponent(`${song.title} ${song.artist} cifra violão`);
    window.open(`https://www.google.com/search?q=${q}`, '_blank');
  }

  // ── Loading / Not found ────────────────────────────────────────────────────
  if (!song) {
    return (
      <div
        className="text-center py-20"
        style={{ color: 'var(--text-muted)' }}
      >
        <div className="text-5xl mb-4">🎵</div>
        <p>Música não encontrada.</p>
        <button
          className="btn btn-ghost mt-4"
          onClick={() => onNavigate('home')}
        >
          ← Voltar
        </button>
      </div>
    );
  }

  // Altura extra para o auto-scroll bar
  const scrollBarHeight = 64;

  return (
    <>
      <div style={{ minHeight: '100vh', paddingBottom: scrollBarHeight + 24 }}>
        {/* ── Header da música ─────────────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(180deg, var(--bg-700) 0%, var(--bg-800) 100%)',
            borderBottom: '1px solid var(--border)',
            padding: '1.25rem 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ maxWidth: 768, margin: '0 auto' }}>
            {/* Navegação */}
            <div className="flex items-center gap-2 mb-2">
              <button
                className="btn btn-ghost"
                onClick={() => onNavigate('home')}
                style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
              >
                ← Voltar
              </button>

              <div
                style={{
                  width: 1,
                  height: 16,
                  background: 'var(--border)',
                }}
              />

              <span
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                {song.artist}
              </span>
            </div>

            {/* Título + ações */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1
                  className="font-display font-bold text-2xl"
                  style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}
                >
                  {song.title}
                </h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`badge ${difficultyClass(song.difficulty)}`}>
                    {difficultyLabel(song.difficulty)}
                  </span>
                  {song.key && (
                    <span
                      className="font-mono text-xs"
                      style={{ color: 'var(--accent)', opacity: 0.8 }}
                    >
                      Tom: {song.key}
                      {song.capo > 0 && ` · Capo ${song.capo}`}
                    </span>
                  )}
                  {song.bpm && (
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ♩ {song.bpm} BPM
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  className="btn btn-ghost"
                  onClick={searchOnWeb}
                  title="Buscar cifra na web"
                  style={{ fontSize: '0.75rem' }}
                >
                  🔎 Buscar na web
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={() => onNavigate('editor', { songId: song.id })}
                  title="Editar cifra"
                  style={{ fontSize: '0.75rem' }}
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={toggleFavorite}
                  style={{
                    background: song.favorite
                      ? 'rgba(239,68,68,0.12)'
                      : 'var(--bg-600)',
                    border: `1px solid ${song.favorite ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                    color: song.favorite ? '#f87171' : 'var(--text-secondary)',
                    borderRadius: 8,
                    padding: '0.4rem 0.7rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.15s',
                  }}
                  title={song.favorite ? 'Remover dos favoritos' : 'Favoritar'}
                  aria-label="Favoritar"
                >
                  {song.favorite ? '❤️' : '🤍'}
                </button>
              </div>
            </div>

            {/* Abas */}
            <div className="flex gap-1 mt-3">
              {[
                { id: 'cifra',   label: '🎸 Cifra'  },
                { id: 'video',   label: '🎬 Vídeo'  },
                { id: 'acordes', label: '🎼 Acordes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background:
                      activeTab === tab.id
                        ? 'rgba(245,158,11,0.15)'
                        : 'transparent',
                    border:
                      activeTab === tab.id
                        ? '1px solid rgba(245,158,11,0.35)'
                        : '1px solid transparent',
                    borderRadius: 8,
                    padding: '0.3rem 0.75rem',
                    color:
                      activeTab === tab.id
                        ? 'var(--accent)'
                        : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Conteúdo da aba ──────────────────────────────────────────────── */}
        <div style={{ maxWidth: 768, margin: '0 auto', padding: '1.5rem' }}>
          {/* Aba: Cifra */}
          {activeTab === 'cifra' && (
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'var(--bg-800)',
                border: '1px solid var(--border)',
              }}
            >
              {/* Acordes necessários */}
              {song.chords && song.chords.length > 0 && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Acordes:
                  </span>
                  {song.chords.map((c) => (
                    <button
                      key={c}
                      className="chord-token"
                      onClick={() => handleChordClick(c)}
                      style={{ cursor: 'pointer' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              <SongViewer
                blocks={blocks}
                onChordClick={handleChordClick}
                highlightLine={highlightLine}
              />
            </div>
          )}

          {/* Aba: Vídeo */}
          {activeTab === 'video' && (
            <div>
              <VideoPlayer videoId={song.videoId} title={`${song.title} — ${song.artist}`} />
              {song.videoId && (
                <p
                  className="text-xs text-center mt-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Toque o vídeo enquanto treina a cifra na aba 🎸
                </p>
              )}
            </div>
          )}

          {/* Aba: Acordes da música */}
          {activeTab === 'acordes' && (
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'var(--bg-800)',
                border: '1px solid var(--border)',
              }}
            >
              <h2
                className="font-display font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Acordes desta música
              </h2>
              <ChordLibrary
                filter={song.chords}
                onSelectChord={setModalChord}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Auto-scroll bar ───────────────────────────────────────────────── */}
      <AutoScroll
        isPlaying={scrollPlaying}
        speed={scrollSpeed}
        onToggle={() => setScrollPlaying((v) => !v)}
        onSpeedUp={() => setScrollSpeed((s) => Math.min(10, s + 1))}
        onSpeedDown={() => setScrollSpeed((s) => Math.max(1, s - 1))}
        onReset={handleScrollReset}
      />

      {/* ── Modal de acorde ──────────────────────────────────────────────── */}
      <ChordModal chord={modalChord} onClose={() => setModalChord(null)} />
    </>
  );
}
