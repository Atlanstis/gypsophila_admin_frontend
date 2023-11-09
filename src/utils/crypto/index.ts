import CryptoJS from 'crypto-js';

/** 密钥 */
const CRYPTO_SECRET = 'T$38Wb$!GMr6sV4&wcYCbGnjxA7x3RST';

/**
 * 加密数据
 * @param data 需加密的数据
 */
export function encrypt(data: any) {
  const text = JSON.stringify(data);
  return CryptoJS.AES.encrypt(text, CRYPTO_SECRET).toString();
}

/**
 * 解密数据
 * @param cipherText 密文
 */
export function decrypt(cipherText: string) {
  const bytes = CryptoJS.AES.decrypt(cipherText, CRYPTO_SECRET);
  const text = bytes.toString(CryptoJS.enc.Utf8);
  return text ? JSON.parse(text) : null;
}
