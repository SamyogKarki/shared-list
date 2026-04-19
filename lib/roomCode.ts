const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

export function generateRoomCode(): string {
  let code = "";
  const array = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(array);
  for (const byte of array) {
    code += ALPHABET[byte % ALPHABET.length];
  }
  return code;
}
