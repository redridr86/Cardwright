const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  out.set(new TextEncoder().encode(type), 4);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

function isPng(bytes: Uint8Array): boolean {
  return PNG_SIGNATURE.every((value, index) => bytes[index] === value);
}

function findChunk(bytes: Uint8Array, type: string): number {
  if (!isPng(bytes)) throw new Error("That file is not a PNG.");
  let offset = 8;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset);
    const name = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    if (name === type) return offset;
    offset += 12 + length;
  }
  throw new Error("That PNG is missing its ending.");
}

export function injectTextChunk(png: Uint8Array, keyword: string, text: string): Uint8Array {
  const start = findChunk(png, "IEND");
  const payload = new Uint8Array(keyword.length + 1 + text.length);
  payload.set(new TextEncoder().encode(keyword), 0);
  payload.set(new TextEncoder().encode(text), keyword.length + 1);
  const extra = chunk("tEXt", payload);
  const out = new Uint8Array(png.length + extra.length);
  out.set(png.subarray(0, start), 0);
  out.set(extra, start);
  out.set(png.subarray(start), start + extra.length);
  return out;
}

export function readTextChunk(png: Uint8Array, keyword: string): string | null {
  if (!isPng(png)) return null;
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  let offset = 8;
  while (offset + 12 <= png.length) {
    const length = view.getUint32(offset);
    const name = String.fromCharCode(png[offset + 4], png[offset + 5], png[offset + 6], png[offset + 7]);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > png.length) return null;
    if (name === "tEXt") {
      const data = png.subarray(dataStart, dataEnd);
      const split = data.indexOf(0);
      const key = new TextDecoder().decode(split >= 0 ? data.subarray(0, split) : data);
      if (key === keyword) {
        return new TextDecoder().decode(split >= 0 ? data.subarray(split + 1) : new Uint8Array());
      }
    }
    offset = dataEnd + 4;
  }
  return null;
}
