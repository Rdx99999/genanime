
import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { hmac } from '@noble/hashes/hmac';
import { utf8ToBytes } from '@noble/hashes/utils';

/**
 * Hash utilities using the @noble/hashes library
 */
export const hashUtils = {
  /**
   * Generate SHA-256 hash of a string
   * @param message - Message to hash
   * @returns Hex string of the hash
   */
  sha256: (message: string): string => {
    const messageBytes = utf8ToBytes(message);
    const hash = sha256(messageBytes);
    return Array.from(hash)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  /**
   * Generate SHA-512 hash of a string
   * @param message - Message to hash
   * @returns Hex string of the hash
   */
  sha512: (message: string): string => {
    const messageBytes = utf8ToBytes(message);
    const hash = sha512(messageBytes);
    return Array.from(hash)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  /**
   * Generate RIPEMD-160 hash of a string
   * @param message - Message to hash
   * @returns Hex string of the hash
   */
  ripemd160: (message: string): string => {
    const messageBytes = utf8ToBytes(message);
    const hash = ripemd160(messageBytes);
    return Array.from(hash)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  /**
   * Generate HMAC using SHA-256
   * @param message - Message to authenticate
   * @param key - Secret key
   * @returns Hex string of the HMAC
   */
  hmacSha256: (message: string, key: string): string => {
    const messageBytes = utf8ToBytes(message);
    const keyBytes = utf8ToBytes(key);
    const hmacOutput = hmac(sha256, keyBytes, messageBytes);
    return Array.from(hmacOutput)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
};

export default hashUtils;
