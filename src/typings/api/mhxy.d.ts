declare namespace ApiMhxy {
  /** 角色 */
  interface AccountRole {
    /** 值 */
    value:
      | 'jxk'
      | 'wmr'
      | 'xys'
      | 'fyn'
      | 'msj'
      | 'ynx'
      | 'yxh'
      | 'ltz'
      | 'xce'
      | 'wtj'
      | 'stb'
      | 'yls'
      | 'mll-x'
      | 'spl'
      | 'gjl'
      | 'htg'
      | 'hmr'
      | 'jmw'
      | 'mll-m'
      | 'mqs';
    /** 角色名称 */
    label: string;
    /** 种族 */
    type: string;
  }

  /** 门派 */
  interface AccountSect {
    /** 值 */
    value:
      | 'dtgf'
      | 'fcs'
      | 'stl'
      | 'pts'
      | 'ycdf'
      | 'lg'
      | 'mwz'
      | 'hss'
      | 'yg'
      | 'nec'
      | 'xly'
      | 'hgs'
      | 'xmh';
    /** 门派名称 */
    label: string;
  }

  /** 账号 */
  interface Account {
    id: string;
    /** 账号名称 */
    name: string;
    /** 是否是主号 */
    isPrimary: boolean;
    /** 角色 */
    role: AccountRole['value'];
    /** 门派 */
    sect: AccountSect['value'];
    /** 当前金币数 */
    gold: number;
  }

  /** 贸易种类 */
  interface GoldTradeCategory {
    id: number;
    name: string;
    status?: 0 | 1;
  }

  /** 金币收支记录 */
  interface AccountGoldRecord {
    id: number;
    /** 数额 */
    amount: number;
    /** 操作前金币数量 */
    beforeGold: number;
    /** 操作后金币数量 */
    afterGold: number;
    /** 记录类型: expenditure-支出,revenue-收入 */
    type: 'expenditure' | 'revenue';
    /** 贸易种类 */
    category: GoldTradeCategory;
    /** 归属梦幻账户 */
    account: Account;
    /** 备注 */
    remark: string;
    /** 是否是转金 */
    isTransfer: boolean;
    /** 记录时间 */
    createTime: Date;
  }

  /** 转金记录 */
  interface AccountGoldTransfer {
    id: number;
    /** 发起账号 */
    fromAccount: Account;
    /** 接收账号 */
    toAccount: Account;
    /** 发起账号转金前金币数量 */
    fromBeforeGold: number;
    /** 发起账号转金前后金币数量 */
    fromAfterGold: number;
    /** 接受账号转金前金币数量 */
    toBeforeGold: number;
    /** 接受账号转金后金币数量 */
    toAfterGold: number;
    /** 贸易种类 */
    category: GoldTradeCategory;
    /** 转金时间 */
    createTime: Date;
  }
}
