/**
 * App.jsx
 * Roteador principal do ViolãoApp.
 * Gerencia qual página está ativa usando estado local (sem react-router).
 *
 * Páginas disponíveis:
 *  - home:    Home.jsx    → lista de músicas
 *  - song:    SongPage.jsx → cifra + vídeo + acordes
 *  - editor:  EditorPage.jsx → editor de cifras
 *  - library: ChordLibrary inline (página standalone de acordes)
 */

import React, { useState } from 'react';
import Home          from './pages/Home';
import SongPage      from './pages/SongPage';
import EditorPage    from './pages/EditorPage';
import ChordLibrary  from './components/ChordLibrary';
import ChordModal    from './components/ChordModal';

export default function App() {
  // Estado de rota: { page, params }
  const [route, setRoute] = useState({ page: 'home', params: {} });

  // Modal global de acorde (para a LibraryPage)
  const [libraryModal, setLibraryModal] = useState(null);

  function navigate(page, params = {}) {
    setRoute({ page, params });
    // Scroll ao topo na mudança de página
    window.scrollTo({ top: 0 });
  }

  const { page, params } = route;

  return (
    <>
      {page === 'home' && (
        <Home onNavigate={navigate} />
      )}

      {page === 'song' && (
        <SongPage
          songId={params.songId}
          onNavigate={navigate}
        />
      )}

      {page === 'editor' && (
        <EditorPage
          songId={params.songId || null}
          onNavigate={navigate}
        />
      )}

      {page === 'library' && (
        <div style={{ minHeight: '100vh', background: 'var(--bg-900)' }}>
          {/* Header da biblioteca */}
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
            <div style={{ maxWidth: 768, margin: '0 auto' }}>
              <button
                className="btn btn-ghost mb-2"
                onClick={() => navigate('home')}
                style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
              >
                ← Voltar
              </button>
              <h1
                className="font-display font-bold text-2xl"
                style={{ color: 'var(--text-primary)' }}
              >
                🎼 Biblioteca de Acordes
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Clique em qualquer acorde para ver o diagrama completo
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div style={{ maxWidth: 768, margin: '0 auto', padding: '1.5rem' }}>
            <ChordLibrary onSelectChord={setLibraryModal} />
          </div>

          {/* Modal de acorde */}
          <ChordModal
            chord={libraryModal}
            onClose={() => setLibraryModal(null)}
          />
        </div>
      )}
    </>
  );
}
