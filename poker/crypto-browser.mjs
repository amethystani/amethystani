// crypto.randomInt replacement for poker-ts when running in a secure browser context.
export function randomInt(max) {
  if (!Number.isSafeInteger(max) || max <= 0) throw new RangeError('max must be a positive safe integer');
  const range = 0x100000000;
  const limit = Math.floor(range / max) * max;
  const word = new Uint32Array(1);
  let n;
  do { globalThis.crypto.getRandomValues(word); n = word[0]; } while (n >= limit);
  return n % max;
}
