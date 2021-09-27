// import TripleDES from 'crypto-js/tripledes'
// import Utf8 from 'crypto-js/enc-utf8'
// import ECB from 'crypto-js/mode-ecb'
// import Pkcs7Pad from 'crypto-js/pad-pkcs7'
// import HexFormat from 'crypto-js/format-hex'
// const encrypt = (content: string, key: string) => {
//   return TripleDES.encrypt(content, Utf8.parse(key), {
//     mode: ECB,
//     padding: Pkcs7Pad
//   }).toString(HexFormat)
// }

type buf = ArrayBuffer | Uint8Array
type KeyLength = 1024 | 2048 | 4096
type shaName = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export function buf2hex(buffer: buf): string {
  new Uint8Array(buffer).map((item) => 1)
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
    .join('')
}
export function hex2buf(hex: string): buf {
  return new Uint8Array(
    hex.match(/[\da-f]{2}/gi)!.map(function (h) {
      return parseInt(h, 16)
    })
  )
}

export function str2buf(str: string): buf {
  return new TextEncoder().encode(str)
}

export function buf2str(buf: buf): string {
  return new TextDecoder().decode(buf)
}

/**
 * base64 string to Uint8Array
 * @param {string} base64
 */
export function base64ToUint8Array(base64: string) {
  const byteString = window.atob(base64)
  const bytes = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i)
  }
  return bytes
}

/**
 * ArrayBuffer to base64 string
 * @param {ArrayBuffer} buffer
 * @returns
 */
export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

// class WinCrypto {
//   eat() {
//     console.log('cc')
//   }
// }
// const winCrypto = new WinCrypto()

async function sha(name: shaName, value: string) {
  const hash = await window.crypto.subtle.digest({ name }, str2buf(value))
  return buf2hex(hash)
}

async function sha1(value: string) {
  return sha('SHA-1', value)
}
async function sha256(value: string) {
  return sha('SHA-256', value)
}
async function sha384(value: string) {
  return sha('SHA-384', value)
}
async function sha512(value: string) {
  return sha('SHA-512', value)
}

async function hmac(key: CryptoKey, value: string) {
  const signature = await window.crypto.subtle.sign(
    {
      name: 'HMAC'
    },
    key, // from generateKey or importKey above
    str2buf(value) // ArrayBuffer of data you want to sign
  )
  return buf2hex(signature)
}

async function hmacGenerateKey(name: shaName) {
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'HMAC',
      hash: { name }
    },
    false,
    ['sign', 'verify'] // can be any combination of "sign" and "verify"
  )
  return key
}

async function hmacImportKey(name: shaName, keyStr: string) {
  const key = await window.crypto.subtle.importKey(
    'raw', // can be "jwk" or "raw"
    str2buf(keyStr),
    {
      // this is the algorithm options
      name: 'HMAC',
      hash: { name } // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      // length: 256, //optional, if you want your key length to differ from the hash function's block length
    },
    false, // whether the key is extractable (i.e. can be used in exportKey)
    ['sign', 'verify'] // can be any combination of "sign" and "verify"
  )
  return key
}

async function hmacSha1(keyStr: string, value: string) {
  const key = await hmacImportKey('SHA-1', keyStr)
  return await hmac(key, value)
}
async function hmacSha256(keyStr: string, value: string) {
  const key = await hmacImportKey('SHA-256', keyStr)
  return await hmac(key, value)
}
async function hmacSha384(keyStr: string, value: string) {
  const key = await hmacImportKey('SHA-384', keyStr)
  return await hmac(key, value)
}
async function hmacSha512(keyStr: string, value: string) {
  const key = await hmacImportKey('SHA-512', keyStr)
  return await hmac(key, value)
}

async function RsaGenerateKey(keyLength: KeyLength) {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: keyLength, // can be 1024, 2048, or 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' }
    },
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'] // must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
  )
}
async function RsaEncrypt(str: string, key: CryptoKey) {
  const result = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    key, // from generateKey or importKey above
    str2buf(str) // ArrayBuffer of data you want to encrypt
  )

  return result
}

async function RsaDecrypt(str: string, key: CryptoKey) {
  const result = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP'
    },
    key, // from generateKey or importKey above
    base64ToUint8Array(str) // ArrayBuffer of the data
  )

  return result
}

async function RsaExportKey(key: CryptoKey) {
  return await window.crypto.subtle.exportKey('jwk', key)
}
export {
  sha1,
  sha256,
  sha384,
  sha512,
  hmacGenerateKey,
  hmacSha1,
  hmacSha256,
  hmacSha384,
  hmacSha512,
  RsaGenerateKey,
  RsaExportKey,
  RsaEncrypt,
  RsaDecrypt
}
