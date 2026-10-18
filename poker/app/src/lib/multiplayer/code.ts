// Room codes: six characters you can read out over a call.
//
// No 0/O, 1/I/L: the letters people mishear or mistype are left out, so a code
// copied off a screen or said aloud arrives as the one that was sent. Thirty-one
// characters to the sixth is about 890 million codes, against a handful of
// rooms open at once, so guessing one is not a way into somebody's game.

export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const CODE_LENGTH = 6

/** A fresh code. `randomInt(n)` must return an integer in [0, n). */
export function newRoomCode(randomInt: (n: number) => number): string {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
  return code
}

/**
 * A code as somebody typed it, or null if it cannot be one.
 *
 * Case, spaces and dashes are forgiven. Look-alikes are not guessed at: a code
 * with an O in it was mistyped, and turning it into some other letter would
 * send them to a stranger's room rather than tell them to check it.
 */
export function normaliseRoomCode(input: string): string | null {
  const code = input.toUpperCase().replace(/[\s-]/g, '')
  if (code.length !== CODE_LENGTH) return null
  for (const ch of code) if (!CODE_ALPHABET.includes(ch)) return null
  return code
}
