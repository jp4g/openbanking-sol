import { BoundedVec } from "./types";
import { MAX_JWT_SIZE } from "./constants";

/**
 * Takes a base64 url string and converts it to bytes
 * 
 * @param base64Url - base64 url string
 * @returns - base64 url as bytes
 */
export function base64UrlToBytes(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Padded = base64 + padding;
  return Uint8Array.from(atob(base64Padded), (c) => c.charCodeAt(0));
}


/**
 * Takes a byte array and serializes it to a bigint
 * 
 * @param bytes - byte array
 * @returns bigint representation of bytes
 */
export function bytesToBigInt(bytes: Uint8Array): bigint {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return BigInt(`0x${hex}`);
}

/**
 * Turns an Uint8Array into a BoundedVec type for input into a noir circuit
 * 
 * @param data - data passed in to convert to BoundedVec storage
 * @param maxLength - maximum length the BoundedVec can be
 * @param fillVal - value to pad add end of storage past data length
 * @returns - BoundedVed representation of array
 */
export function toBoundedVec(
  data: Uint8Array,
  maxLength: number,
  fillVal: number = 0
): BoundedVec {
  const length = maxLength === undefined ? MAX_JWT_SIZE : maxLength;
  if (data.length > length) {
    throw new Error(`Data exceeds maximum length of ${length} bytes`);
  }
  const storage = Array.from(data)
    .concat(Array(length - data.length).fill(fillVal))
    .map((byte) => byte.toString());
  return { storage, len: data.length.toString() };
}


/**
 * Serializes a Uint8Array to a Uint32Array
 * 
 * @param input - a Uint8Array
 * @returns - a Uint32Array
 */
export function u8ToU32(input: Uint8Array): Uint32Array {
  const out = new Uint32Array(input.length / 4);
  for (let i = 0; i < out.length; i++) {
    out[i] =
      (input[i * 4 + 0] << 24) |
      (input[i * 4 + 1] << 16) |
      (input[i * 4 + 2] << 8) |
      (input[i * 4 + 3] << 0);
  }
  return out;
}