import { decrypt, encrypt } from '../crypto';

/** 本地存储的键值类型 */
interface Local {
  token: string;
}

/** Local 键值枚举 */
export const enum LocalKeyEnum {
  /** 认证 token */
  Token = 'token',
}

function createLocalStorage<T extends Local = Local, K extends LocalKeyEnum = LocalKeyEnum>() {
  /** 默认缓存期限为7天 */
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

  /**
   * 设置值至 localstorage
   * @param key 键
   * @param value 值
   * @param expire 过期时间，单位：秒
   */
  function set(key: K, value: T[K], expire: number | null = DEFAULT_CACHE_TIME) {
    const storageData: StorageSpace.Data<T[K]> = {
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    };
    window.localStorage.setItem(key as string, encrypt(storageData));
  }

  /**
   * 从 localstorage 取值
   * @param key 键
   * @returns localstorage 相应键中的值
   */
  function get(key: K) {
    const str = window.localStorage.getItem(key as string);
    if (str) {
      let storageData: StorageSpace.Data<T[K]> | null = null;
      try {
        storageData = decrypt(str);
      } catch {
        window.console.error(`[localStorage：${key}] 解密失败：${str}`);
        return null;
      }
      if (storageData) {
        const { value, expire } = storageData;
        if (expire === null || expire >= Date.now()) {
          return value;
        }
      }
    }
    remove(key);
    return null;
  }

  /**
   * 从 localstorage 中删除键相对应的值
   * @param key 键
   */
  function remove(key: K) {
    window.localStorage.removeItem(key as string);
  }

  /**
   * 清空所有 localstorage
   */
  function clear() {
    window.localStorage.clear();
  }

  return {
    set,
    get,
    remove,
    clear,
  };
}

export const localStorage = createLocalStorage();
