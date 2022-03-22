const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const base32 = (data: string) => {
    const buffer = Buffer.from(data, 'utf-8');
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  
    let bits = 0;
    let value = 0;
    let result = '';
  
    for (let i = 0; i < view.byteLength; i++) {
      value = (value << 8) | view.getUint8(i)
      bits += 8
  
      while (bits >= 5) {
        result += ALPHABET[(value >>> (bits - 5)) & 31]
        bits -= 5
      }
    }
  
    if (bits > 0) {
        result += ALPHABET[(value << (5 - bits)) & 31]
    }
  
    return result;
};

export default base32;
