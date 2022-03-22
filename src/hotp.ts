import * as crypto from "crypto";

/**
 * Generats HOTP codes.
 * @param {string} user_secret Users secret string.
 * @param {number} time Time counter value to generate a code for.
 * @param {number} digits Length of the resulting code.
 * @returns {string} The generated code.
 */
export default function hotp(
  user_secret: string,
  time: number,
  digits: 6 | 7 | 8
): string {
  const buffer = Buffer.from(user_secret, "utf-8");
  const bytes = Buffer.allocUnsafe(8);
  bytes.writeBigInt64BE(BigInt(time));

  const hmac = crypto.createHmac("sha1", buffer);
  hmac.update(bytes);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0xf;
  return ((hash.readInt32BE(offset) & 0x7fffffff) % Math.pow(10, digits))
    .toString()
    .padStart(digits, "0");
}
