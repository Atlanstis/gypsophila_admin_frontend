/**
 * 从对象中挑选指定的键，并返回一个新的对象，该对象只包含指定的键值对。
 * @template T - 原始对象的类型。
 * @template K - 挑选的键的类型，必须是 T 的键之一。
 * @param obj - 原始对象。
 * @param keys - 需要挑选的键的数组。
 * @returns 一个新的对象，只包含原始对象中指定的键值对。
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}
