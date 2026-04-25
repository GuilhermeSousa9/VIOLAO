/**
 * Editor.jsx
 * Editor de cifras com:
 *  - Campo para colar/editar cifra
 *  - Formatação automática (detecta acordes)
 *  - Salvar no localStorage
 *  - Preview da cifra formatada
 *
 * Props:
 *  - song:     objeto da música (ou null para nova)
 *  - onSave:   (updatedSong) => void
 *  - onCancel: () => void
 */

import React, { useState, useEffect } from 'react';
import { autoFormatTab, parseSong } from '../utils/parser';
import SongViewer from './SongViewer';

/* Ícone de formatação */
const FormatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="15" y2="12" />
    <line x1="3" y1="18" x2="18" y2="18" />
  </svg>
);

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
);

export default function Editor({ song, onSave, onCancel }) {
  const [title, setTitle]   = useState(song?.title   || '');
  const [artist, setArtist] = useState(song?.artist  || '');
  const [videoId, setVideoId] = useState(song?.videoId || '');
  const [tab, setTab]       = useState(song?.tab     || '');
  const [preview, setPreview] = useState(false);
  const [saved, setSaved]   = useState(false);

  // Carregar rascunho do localStorage
  useEffect(() => {
    const draftKey = song ? `draft_${song.id}` : 'draft_new';
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        if (!song) {
          setTitle(data.title  || '');
          setArtist(data.artist || '');
          setVideoId(data.videoId || '');
        }
        setTab(data.tab || '');
      } catch (_) {
        /* ignora JSON inválido */
      }
    }
  }, [song]);

  // Salvar rascunho automaticamente no localStorage
  useEffect(() => {
    const draftKey = song ? `draft_${song.id}` : 'draft_new';
    const data = { title, artist, videoId, tab };
    localStorage.setItem(draftKey, JSON.stringify(data));
  }, [title, artist, videoId, tab, song]);

  // Formatar automaticamente a cifra
  function handleAutoFormat() {
    const formatted = autoFormatTab(tab);
    setTab(formatted);
  }

  // Salvar música
  function handleSave() {
    if (!title.trim()) {
      alert('Por favor, informe o título da música.');
      return;
    }
    const updatedSong = {
      ...(song || {}),
      id:      song?.id || String(Date.now()),
      title:   title.trim(),
      artist:  artist.trim(),
      videoId: videoId.trim(),
      tab,
      favorite: song?.favorite || false,
      difficulty: song?.difficulty || 'medium',
    };

    // Salvar no localStorage
    const storageKey = `song_${updatedSong.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedSong));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    onSave?.(updatedSong);
  }

  // Parse para preview
  const blocks = parseSong(tab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Metadados */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'var(--bg-700)',
          border: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
        }}
      >
        <div className="flex flex-col gap-1">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Título da música *
          </label>
          <input
            type="text"
            className="input"
            placeholder="Ex: Wonderwall"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Artista / Banda
          </label>
          <input
            type="text"
            className="input"
            placeholder="Ex: Oasis"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1" style={{ gridColumn: '1 / -1' }}>
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            ID do YouTube (opcional)
          </label>
          <input
            type="text"
            className="input"
            placeholder="Ex: bx1Bh8ZvH84 (parte final da URL do YouTube)"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
          />
        </div>
      </div>

      {/* Editor de cifra */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--bg-700)', border: '1px solid var(--border)' }}
      >
        {/* Cabeçalho do editor */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3
            className="font-display font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Cifra
          </h3>

          <div className="flex items-center gap-2">
            {/* Toggle preview */}
            <button
              className="btn btn-ghost"
              onClick={() => setPreview((v) => !v)}
              style={{ fontSize: '0.8rem' }}
            >
              {preview ? '✏️ Editar' : '👁 Preview'}
            </button>

            {/* Formatar automaticamente */}
            <button
              className="btn btn-ghost"
              onClick={handleAutoFormat}
              title="Detectar e formatar acordes automaticamente"
              style={{ fontSize: '0.8rem' }}
            >
              <FormatIcon /> Auto-formatar
            </button>
          </div>
        </div>

        {/* Dica de formato */}
        <div
          className="rounded-lg p-3 mb-3 text-xs leading-relaxed"
          style={{
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
            color: 'var(--text-secondary)',
          }}
        >
          <strong style={{ color: 'var(--accent)' }}>Formato:</strong>{' '}
          Use <code className="font-mono" style={{ color: 'var(--accent)' }}>[Acorde]</code> antes de cada trecho.
          Ex: <code className="font-mono">[C]Hoje é o [Am]dia</code>. Para seções:{' '}
          <code className="font-mono">||VERSO||</code>
        </div>

        {preview ? (
          /* Preview renderizado */
          <div
            className="rounded-xl p-4"
            style={{
              background: 'var(--bg-800)',
              minHeight: 200,
              border: '1px solid var(--border)',
            }}
          >
            {tab ? (
              <SongViewer
                blocks={blocks}
                onChordClick={() => {}}
                highlightLine={null}
              />
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Digite a cifra ao lado para ver o preview aqui...
              </p>
            )}
          </div>
        ) : (
          /* Textarea de edição */
          <textarea
            className="input"
            rows={18}
            placeholder={`||VERSO||
[C]Exemplo de [Am]letra
[F]Com acordes [G]marcados

[C]Outra linha [G]aqui`}
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            spellCheck={false}
          />
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>

        <div className="flex items-center gap-2">
          {/* Indicador de salvo */}
          {saved && (
            <span
              className="text-sm font-semibold"
              style={{
                color: '#4ade80',
                animation: 'fadeIn 0.3s ease',
              }}
            >
              ✓ Salvo!
            </span>
          )}

          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ gap: 6 }}
          >
            <SaveIcon /> Salvar cifra
          </button>
        </div>
      </div>
    </div>
  );
}
