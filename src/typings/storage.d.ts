/** 本地存储相关 */
declare namespace StorageSpace {
  /** 本地存储的键值类型 */
  interface Local {
    /** 认证 token */
    token: string;
    /** admin 菜单折叠状态 */
    adminMenuCollapsed: boolean;
  }

  /** 存储数据格式 */
  interface Data<T> {
    value: T;
    expire: number | null;
  }
}
