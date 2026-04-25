/**
 * VideoPlayer.jsx
 * Exibe um player de vídeo do YouTube embutido via iframe.
 * Mostra thumbnail clicável antes de carregar o iframe (lazy load).
 *
 * Props:
 *  - videoId: string (ID do vídeo no YouTube)
 *  - title:   string (título para acessibilidade)
 */

import React, { useState } from 'react';

/* Ícone de play */
const PlayIcon = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="26" cy="26" r="26" fill="rgba(245,158,11,0.9)" />
    <polygon points="21,16 38,26 21,36" fill="#0d0d0f" />
  </svg>
);

export default function VideoPlayer({ videoId, title = 'Vídeo da música' }) {
  const [active, setActive] = useState(false);

  if (!videoId) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl"
        style={{
          background: 'var(--bg-700)',
          border: '1px solid var(--border)',
          height: 220,
          color: 'var(--text-muted)',
          gap: 8,
        }}
      >
        <span style={{ fontSize: '2rem' }}>🎬</span>
        <span style={{ fontSize: '0.85rem' }}>Nenhum vídeo disponível</span>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  if (active) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9
          background: '#000',
          border: '1px solid var(--border)',
        }}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    );
  }

  // Thumbnail clicável (lazy load)
  return (
    <div
      onClick={() => setActive(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') setActive(true); }}
      className="rounded-2xl overflow-hidden"
      style={{
        position: 'relative',
        paddingTop: '56.25%',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        transition: 'border-color 0.2s',
      }}
      aria-label={`Assistir: ${title}`}
      title={`Assistir: ${title}`}
    >
      {/* Thumbnail */}
      <img
        src={thumbnailUrl}
        alt={title}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.6)',
          transition: 'filter 0.25s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.75)')}
        onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(0.6)')}
      />

      {/* Overlay gradiente */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(13,13,15,0.8) 0%, transparent 60%)',
        }}
      />

      {/* Botão de play centralizado */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        className="hover:scale-110"
      >
        <PlayIcon />
      </div>

      {/* Título na base */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 14,
          right: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <svg width="14" height="10" viewBox="0 0 24 17" fill="#f59e0b">
          <path d="M23.5 2.5a3 3 0 0 0-2.1-2.1C19.5 0 12 0 12 0S4.5 0 2.6.4A3 3 0 0 0 .5 2.5C0 4.4 0 8.5 0 8.5s0 4.1.5 6a3 3 0 0 0 2.1 2.1C4.5 17 12 17 12 17s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1c.5-1.9.5-6 .5-6s0-4.1-.5-6zM9.6 12.1V4.9l6.3 3.6-6.3 3.6z" />
        </svg>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
          {title}
        </span>
      </div>
    </div>
  );
}
