/**
 * parser.js
 * Converte texto de cifra em estrutura renderizável pelo React.
 *
 * Formato de entrada esperado:
 *   [Acorde]texto da letra [Acorde2]mais texto
 *   ||SEÇÃO||
 *
 * Formato de saída (array de blocos):
 *   [
 *     { type: 'section', label: 'VERSO' },
 *     { type: 'line', segments: [
 *         { chord: 'C', lyric: 'texto ' },
 *         { chord: 'Am', lyric: 'mais texto' },
 *     ]},
 *     { type: 'blank' },
 *   ]
 */

// Regex para capturar acordes entre colchetes: [Am7], [G], [Dsus4], etc.
const CHORD_REGEX = /\[([A-G][^\]]*)\]/g;

// Regex para seções como ||VERSO||, ||REFRÃO||
const SECTION_REGEX = /^\|\|(.+)\|\|$/;

/**
 * Faz o parse de uma linha que pode conter acordes inline.
 * Retorna array de segmentos { chord, lyric }.
 *
 * Exemplo:
 *   "[C]Hoje é o [Am]dia" →
 *   [{ chord: 'C', lyric: 'Hoje é o ' }, { chord: 'Am', lyric: 'dia' }]
 */
function parseLine(line) {
  const segments = [];
  let lastIndex = 0;
  let match;

  // Reinicia o regex
  CHORD_REGEX.lastIndex = 0;

  while ((match = CHORD_REGEX.exec(line)) !== null) {
    const chord = match[1];
    const matchStart = match.index;

    // Texto antes deste acorde (pertence ao segmento anterior)
    const textBefore = line.slice(lastIndex, matchStart);

    if (segments.length === 0 && textBefore) {
      // Texto antes do primeiro acorde → segmento sem acorde
      segments.push({ chord: null, lyric: textBefore });
    } else if (segments.length > 0) {
      // Adiciona texto ao último segmento
      segments[segments.length - 1].lyric += textBefore;
    }

    // Novo segmento iniciado por este acorde
    segments.push({ chord, lyric: '' });

    lastIndex = matchStart + match[0].length;
  }

  // Texto restante após o último acorde
  const remaining = line.slice(lastIndex);
  if (remaining) {
    if (segments.length === 0) {
      // Linha sem nenhum acorde
      segments.push({ chord: null, lyric: remaining });
    } else {
      segments[segments.length - 1].lyric += remaining;
    }
  }

  // Garantir que nunca retornamos array vazio
  if (segments.length === 0 && line.trim() === '') {
    return [];
  }

  return segments;
}

/**
 * Parse completo de uma cifra (string multilinha).
 * Retorna array de blocos para renderização.
 */
export function parseSong(tab) {
  if (!tab) return [];

  const lines = tab.split('\n');
  const blocks = [];

  for (const rawLine of lines) {
    const line = rawLine; // mantém espaços

    // Linha em branco
    if (line.trim() === '') {
      blocks.push({ type: 'blank' });
      continue;
    }

    // Seção: ||VERSO||
    const sectionMatch = line.trim().match(SECTION_REGEX);
    if (sectionMatch) {
      blocks.push({ type: 'section', label: sectionMatch[1] });
      continue;
    }

    // Linha de cifra/letra
    const segments = parseLine(line);
    if (segments.length > 0) {
      blocks.push({ type: 'line', segments });
    }
  }

  return blocks;
}

/**
 * Extrai todos os acordes únicos de uma cifra (string).
 * Útil para listar acordes necessários na música.
 */
export function extractChords(tab) {
  if (!tab) return [];
  const found = new Set();
  let match;
  CHORD_REGEX.lastIndex = 0;
  while ((match = CHORD_REGEX.exec(tab)) !== null) {
    found.add(match[1]);
  }
  return Array.from(found);
}

/**
 * Detecta acordes em texto livre (sem colchetes).
 * Útil no Editor para formatar texto copiado.
 *
 * Adiciona colchetes ao redor de tokens que parecem acordes.
 *
 * Padrão reconhecido:
 *   - Letra A-G
 *   - Opcional: # ou b
 *   - Opcional: m, maj, min, dim, aug, sus, add + números
 *
 * Heurística: linha onde mais de 40% dos tokens são acordes → linha de acordes.
 */
const BARE_CHORD = /\b([A-G][#b]?(?:maj|min|m|dim|aug|sus|add)?(?:\d+)?(?:\/[A-G][#b]?)?)\b/g;

export function autoFormatTab(rawText) {
  if (!rawText) return '';

  const lines = rawText.split('\n');
  const result = [];

  for (const line of lines) {
    // Linha vazia ou de seção → mantém
    if (line.trim() === '' || SECTION_REGEX.test(line.trim())) {
      result.push(line);
      continue;
    }

    // Conta tokens e quantos parecem acordes
    const tokens = line.trim().split(/\s+/);
    let chordCount = 0;
    for (const t of tokens) {
      BARE_CHORD.lastIndex = 0;
      if (BARE_CHORD.test(t)) chordCount++;
    }

    const ratio = tokens.length > 0 ? chordCount / tokens.length : 0;

    if (ratio > 0.5) {
      // Linha predominantemente de acordes → envolver cada acorde em []
      BARE_CHORD.lastIndex = 0;
      const formatted = line.replace(BARE_CHORD, '[$1]');
      result.push(formatted);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}
