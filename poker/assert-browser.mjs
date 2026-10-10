export default function assert(value, message = 'Assertion failed') {
  if (!value) throw new Error(message);
}
