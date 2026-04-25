/**
 * chords.js
 * Biblioteca de acordes para violão.
 *
 * Estrutura de cada acorde:
 *  - name:    nome do acorde (ex: "Am")
 *  - fingers: array de 6 posições, da corda 6 (Mi grave) até corda 1 (Mi agudo)
 *             -1 = corda muda (X)
 *              0 = corda solta
 *             N = número da casa pressionada
 *  - barre:   (opcional) { fret, fromString, toString } — para barras
 *  - label:   nome exibido ao usuário
 *  - notes:   notas do acorde (informativo)
 */

export const CHORDS = [
  // ── Acordes naturais maiores ───────────────────────────────────────────────
  {
    name: 'A',
    label: 'A maior',
    fingers: [-1, 0, 2, 2, 2, 0],
    notes: 'A  E  A  C#  E',
  },
  {
    name: 'B',
    label: 'B maior',
    fingers: [-1, 2, 4, 4, 4, 2],
    barre: { fret: 2, fromString: 1, toString: 5 },
    notes: 'B  F#  B  D#  F#',
  },
  {
    name: 'C',
    label: 'C maior',
    fingers: [-1, 3, 2, 0, 1, 0],
    notes: 'C  E  G  C  E',
  },
  {
    name: 'D',
    label: 'D maior',
    fingers: [-1, -1, 0, 2, 3, 2],
    notes: 'D  A  D  F#',
  },
  {
    name: 'E',
    label: 'E maior',
    fingers: [0, 2, 2, 1, 0, 0],
    notes: 'E  B  E  G#  B  E',
  },
  {
    name: 'F',
    label: 'F maior',
    fingers: [1, 3, 3, 2, 1, 1],
    barre: { fret: 1, fromString: 0, toString: 5 },
    notes: 'F  C  F  A  C  F',
  },
  {
    name: 'G',
    label: 'G maior',
    fingers: [3, 2, 0, 0, 0, 3],
    notes: 'G  B  D  G  B  G',
  },

  // ── Acordes menores ────────────────────────────────────────────────────────
  {
    name: 'Am',
    label: 'A menor',
    fingers: [-1, 0, 2, 2, 1, 0],
    notes: 'A  E  A  C  E',
  },
  {
    name: 'Bm',
    label: 'B menor',
    fingers: [-1, 2, 4, 4, 3, 2],
    barre: { fret: 2, fromString: 1, toString: 5 },
    notes: 'B  F#  B  D  F#',
  },
  {
    name: 'Cm',
    label: 'C menor',
    fingers: [-1, 3, 5, 5, 4, 3],
    barre: { fret: 3, fromString: 1, toString: 5 },
    notes: 'C  G  C  Eb  G',
  },
  {
    name: 'Dm',
    label: 'D menor',
    fingers: [-1, -1, 0, 2, 3, 1],
    notes: 'D  A  D  F',
  },
  {
    name: 'Em',
    label: 'E menor',
    fingers: [0, 2, 2, 0, 0, 0],
    notes: 'E  B  E  G  B  E',
  },
  {
    name: 'Fm',
    label: 'F menor',
    fingers: [1, 3, 3, 1, 1, 1],
    barre: { fret: 1, fromString: 0, toString: 5 },
    notes: 'F  C  F  Ab  C  F',
  },
  {
    name: 'Gm',
    label: 'G menor',
    fingers: [3, 5, 5, 3, 3, 3],
    barre: { fret: 3, fromString: 0, toString: 5 },
    notes: 'G  D  G  Bb  D  G',
  },

  // ── Acordes com 7ª ────────────────────────────────────────────────────────
  {
    name: 'A7',
    label: 'A com sétima',
    fingers: [-1, 0, 2, 0, 2, 0],
    notes: 'A  E  G  C#  E',
  },
  {
    name: 'B7',
    label: 'B com sétima',
    fingers: [-1, 2, 1, 2, 0, 2],
    notes: 'B  F#  A  D#  F#',
  },
  {
    name: 'C7',
    label: 'C com sétima',
    fingers: [-1, 3, 2, 3, 1, 0],
    notes: 'C  E  Bb  C  E',
  },
  {
    name: 'D7',
    label: 'D com sétima',
    fingers: [-1, -1, 0, 2, 1, 2],
    notes: 'D  A  C  F#',
  },
  {
    name: 'E7',
    label: 'E com sétima',
    fingers: [0, 2, 0, 1, 0, 0],
    notes: 'E  B  D  G#  B  E',
  },
  {
    name: 'G7',
    label: 'G com sétima',
    fingers: [3, 2, 0, 0, 0, 1],
    notes: 'G  B  D  G  B  F',
  },

  // ── Acordes com 7ª menor ──────────────────────────────────────────────────
  {
    name: 'Am7',
    label: 'A menor com sétima',
    fingers: [-1, 0, 2, 0, 1, 0],
    notes: 'A  E  G  C  E',
  },
  {
    name: 'Dm7',
    label: 'D menor com sétima',
    fingers: [-1, -1, 0, 2, 1, 1],
    notes: 'D  A  C  F',
  },
  {
    name: 'Em7',
    label: 'E menor com sétima',
    fingers: [0, 2, 0, 0, 0, 0],
    notes: 'E  B  D  G  B  E',
  },

  // ── Suspensos e Adicionados ───────────────────────────────────────────────
  {
    name: 'Csus2',
    label: 'C suspenso 2',
    fingers: [-1, 3, 0, 0, 1, 0],
    notes: 'C  G  C  D  G',
  },
  {
    name: 'Dsus2',
    label: 'D suspenso 2',
    fingers: [-1, -1, 0, 2, 3, 0],
    notes: 'D  A  D  E',
  },
  {
    name: 'Dsus4',
    label: 'D suspenso 4',
    fingers: [-1, -1, 0, 2, 3, 3],
    notes: 'D  A  D  G',
  },
  {
    name: 'Gadd9',
    label: 'G add9',
    fingers: [3, 2, 0, 2, 0, 3],
    notes: 'G  B  D  A  G',
  },
  {
    name: 'Cadd9',
    label: 'C add9',
    fingers: [-1, 3, 2, 0, 3, 0],
    notes: 'C  E  G  D',
  },
];

/**
 * Retorna um acorde pelo nome (case-insensitive).
 * Ex: getChord("Am") → { name:"Am", ... }
 */
export function getChord(name) {
  return CHORDS.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  ) || null;
}

/**
 * Filtra acordes por texto de busca (nome ou label).
 */
export function searchChords(query) {
  const q = query.toLowerCase();
  return CHORDS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.label.toLowerCase().includes(q)
  );
}
