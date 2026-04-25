/**
 * songs.js
 * Banco de músicas de exemplo para o ViolãoApp.
 *
 * Formato de cifra (campo `tab`):
 *  - Linhas de acordes: começam com [
 *  - Linhas de letra: texto normal
 *  - Seções: ||VERSO||, ||REFRÃO||, etc.
 *
 * O parser em utils/parser.js transforma esse texto em estrutura renderizável.
 */

export const SONGS = [
  {
    id: '1',
    title: 'Wonderwall',
    artist: 'Oasis',
    videoId: 'bx1Bh8ZvH84', // YouTube ID
    difficulty: 'easy',
    bpm: 87,
    key: 'F#m',
    capo: 2,
    chords: ['Em7', 'G', 'Dsus4', 'A7sus4', 'Cadd9'],
    favorite: false,
    tab: `||VERSO||
[Em7]Today is gonna be the [G]day
That they're gonna [Dsus4]throw it back to [A7sus4]you
[Em7]By now you should've some[G]how
Realised [Dsus4]what you gotta [A7sus4]do
[Em7]I don't believe that any[G]body
Feels the way I [Dsus4]do about you [A7sus4]now

||PRÉ-REFRÃO||
[Cadd9]Backbeat the [Dsus4]word was on the [Em7]street
That the [G]fire in your [Em7]heart is [G]out
[Cadd9]I'm sure you've [Dsus4]heard it all be[Em7]fore
But you [G]never really [Em7]had a [G]doubt

||REFRÃO||
[Cadd9]And all the [Em7]roads we have to [G]walk are [Dsus4]winding
[Cadd9]And all the [Em7]lights that lead us [G]there are [Dsus4]blinding
[Cadd9]There are many [Em7]things that I would [G]like to say to you
But I [Dsus4]don't know how

[Cadd9]Because [Em7]maybe
[G]You're gonna be the one that [Dsus4]saves me
[Cadd9]And after [Em7]all
[G]You're my wonder[Dsus4]wall`,
  },

  {
    id: '2',
    title: 'Mais que Nada',
    artist: 'Jorge Ben Jor',
    videoId: 'oipksRhKFoM',
    difficulty: 'medium',
    bpm: 120,
    key: 'Gm',
    capo: 0,
    chords: ['Gm', 'D7', 'Cm', 'Am7', 'D'],
    favorite: false,
    tab: `||INTRO||
[Gm] [D7] [Gm] [D7]

||VERSO||
[Gm]Ooh, ooh, ooh
[D7]Ô ô ô, eu quero ver você [Gm]dançar
[Gm]Ooh, ooh, ooh
[D7]Ô ô ô, quando você mexe [Gm]assim
[Cm]Você me faz ir ao [Gm]paraíso
[Am7]Ah, se você [D7]soubesse
Como é que é um [Gm]sorriso

||REFRÃO||
[Cm]Mais que nada
[Gm]Eu quero te ver [D7]sambar
[Cm]Mais que nada
[Gm]É você que vai [D7]dançar
[Cm]Ginga comigo [Gm]moreninha
[Am7]Vai, vai, [D7]vai
[Gm]Vai, meu amor`,
  },

  {
    id: '3',
    title: 'Hallelujah',
    artist: 'Leonard Cohen',
    videoId: 'ttEMYvpoR-k',
    difficulty: 'medium',
    bpm: 62,
    key: 'C',
    capo: 0,
    chords: ['C', 'Am', 'F', 'G', 'Em'],
    favorite: false,
    tab: `||VERSO||
[C]I've heard there was a [Am]secret chord
That [C]David played, and it [Am]pleased the Lord
But [F]you don't really [G]care for music, [C]do you? [G]
It [C]goes like this, the [F]fourth, the [G]fifth
The [Am]minor fall, the [F]major lift
The [G]baffled king com[Em]posing Halle[Am]lujah

||REFRÃO||
[F]Hallelujah, [Am]Hallelujah
[F]Hallelujah, [C]Halle[G]lu[C]jah

||VERSO 2||
[C]Your faith was strong but you [Am]needed proof
You [C]saw her bathing [Am]on the roof
Her [F]beauty and the [G]moonlight over[C]threw you [G]
She [C]tied you to a [F]kitchen [G]chair
She [Am]broke your throne, she [F]cut your hair
And [G]from your lips she [Em]drew the Halle[Am]lujah`,
  },

  {
    id: '4',
    title: 'No Woman No Cry',
    artist: 'Bob Marley',
    videoId: 'IT8XvzIfi4U',
    difficulty: 'easy',
    bpm: 75,
    key: 'C',
    capo: 0,
    chords: ['C', 'G', 'Am', 'F'],
    favorite: false,
    tab: `||VERSO||
[C]No woman, [G]no cry
[Am]No woman, [F]no cry
[C]No woman, [G]no cry
[Am]No woman, [F]no cry

||VERSO 2||
[C]Said, said, [G]said I remember [Am]when we used to [F]sit
In a [C]government yard in [G]Trenchtown
[Am]Oba, ob-[F]serving the [C]hypocrites
As they would [G]mingle with the [Am]good people we [F]meet

[C]Good friends we have, [G]oh good friends we've [Am]lost
Along the [F]way
In this [C]bright future you [G]can't forget your [Am]past
So dry your [F]tears I say

||REFRÃO||
[C]No woman, [G]no cry
[Am]No woman, no [F]cry
[C]No, no woman, [G]no woman no [Am]cry
Oh, [F]no woman, no [C]cry`,
  },
];

/**
 * Retorna uma música pelo id.
 */
export function getSongById(id) {
  return SONGS.find((s) => s.id === id) || null;
}

/**
 * Retorna label de dificuldade em português.
 */
export function difficultyLabel(diff) {
  const map = { easy: 'Iniciante', medium: 'Intermediário', hard: 'Avançado' };
  return map[diff] || diff;
}

/**
 * Retorna classe CSS para o badge de dificuldade.
 */
export function difficultyClass(diff) {
  const map = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  };
  return map[diff] || '';
}
