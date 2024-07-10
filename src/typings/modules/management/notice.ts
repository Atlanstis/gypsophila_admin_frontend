/** 通知类型 */
export enum EnumNoticeType {
  /** 待办 */
  Todo = 'Todo',
  /** 消息 */
  Message = 'Message',
}

/** 通知状态 */
export enum EnumNoticeStatus {
  /** 生效中 */
  Active = 'Active',
  /** 已处理 */
  Handled = 'Handled',
  /** 已过期 */
  Expire = 'Expire',
}

export enum EnumNoticeCategory {}

export interface Notice<T extends EnumNoticeCategory = any> {
  id: number;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 类型 */
  type: EnumNoticeType;
  /** 种类 */
  category: T;
  /** 关联信息 */
  link: NoticeLink;
  /** 状态 */
  status: EnumNoticeStatus;
  /** 过期时间 */
  expireTime: string;
  /** 创建时间 */
  createTime: Date;
}

type NoticeLink = Record<string, any>;
