/** 本地存储相关 */
declare namespace StorageSpace {
  /** 存储数据格式 */
  interface Data<T> {
    value: T;
    expire: number | null;
  }
}
