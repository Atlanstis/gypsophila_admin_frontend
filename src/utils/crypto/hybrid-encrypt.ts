import CryptoJS from 'crypto-js';

// 将 PEM 格式的公钥转换为 CryptoKey 对象
async function importPublicKey(pem: string) {
  // 去除 PEM 头尾和换行符，并确保其是有效的 Base64 编码
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = pem
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, ''); // 去除所有空白字符

  // 将 Base64 编码的字符串转换为 ArrayBuffer
  const binaryDer = str2ab(atob(pemContents));

  return await crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

// 将 CryptoJS WordArray 转换为 Uint8Array
function wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray) {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;

  // 创建一个 Uint8Array 来存储结果
  const u8Array = new Uint8Array(sigBytes);

  let index = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // 处理每个 word，分成 4 个字节
    u8Array[index++] = (word >> 24) & 0xff;
    if (index < sigBytes) u8Array[index++] = (word >> 16) & 0xff;
    if (index < sigBytes) u8Array[index++] = (word >> 8) & 0xff;
    if (index < sigBytes) u8Array[index++] = word & 0xff;
  }

  return u8Array;
}

// 使用 RSA-OAEP 加密 AES 密钥
async function encryptKeyWithRSA(
  aesKeyWordArray: CryptoJS.lib.WordArray,
  publicKeyPem: string
) {
  // 将 WordArray 转换为 Uint8Array
  const aesKey = wordArrayToUint8Array(aesKeyWordArray);

  // 导入公钥
  const publicKey = await importPublicKey(publicKeyPem);

  // 使用 Web Crypto API 加密 AES 密钥
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    aesKey // 这里需要传递 Uint8Array 类型
  );

  return btoa(ab2str(encrypted)); // 将加密结果转换为 Base64 字符串
}

// 将字符串转换为 ArrayBuffer
function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode(...new Uint8Array(buf));
}

// AES 加密数据
export function encryptWithAES(data: string) {
  const key = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });

  return {
    encryptedData: encrypted.toString(),
    key: key,
    iv: CryptoJS.enc.Base64.stringify(iv),
  };
}

// 混合加密：AES + RSA-OAEP
export async function hybridEncrypt(data: string, publicKeyPem: string) {
  const aesResult = encryptWithAES(data);

  const encryptedKey = await encryptKeyWithRSA(aesResult.key, publicKeyPem); // 使用 RSA-OAEP 加密 AES 密钥

  return {
    data: aesResult.encryptedData,
    key: encryptedKey,
    iv: aesResult.iv,
  };
}
