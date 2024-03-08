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
    /** 被锁金币数 */
    lockGold: number;
  }

  /** 道具种类 */
  interface PropCategory {
    id: number;
    /** 名称 */
    name: string;
    /** 是否是珍品 */
    isGem: boolean;
    /** 父种类 */
    parentId: PropCategory['id'];
    /** 子种类 */
    children: PropCategory[];
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
    /** 道具种类 */
    category: PropCategory;
    /** 归属梦幻账户 */
    account: Account;
    /** 备注 */
    remark: string;
    /** 是否是转金 */
    isTransfer: boolean;
    /** 记录时间 */
    createTime: Date;
  }

  /** 转金状态 */
  enum AccountGoldTransferStatus {
    /** 进行中 */
    progress = 'progress',
    /** 转金成功 */
    success = 'success',
    /** 转金失败，转出账号金币被锁 */
    failFromLock = 'failFromLock',
  }

  /** 转金记录 */
  interface AccountGoldTransfer {
    id: number;
    /** 转出账号 */
    fromAccount: Account;
    /** 接收账号 */
    toAccount: Account;
    /** 转出账号转金前金币数量 */
    fromBeforeGold: number;
    /** 转出账号转金前后金币数量 */
    fromAfterGold: number;
    /** 转入账号转金前金币数量 */
    toBeforeGold: number;
    /** 转入账号转金后金币数量 */
    toAfterGold: number;
    /** 道具种类 */
    category: PropCategory;
    /** 转金时间 */
    createTime: Date;
    /** 状态 */
    status: AccountGoldTransferStatus;
    // 是否是珍品转金
    isGem?: boolean;
    /** 珍品交易金额 */
    goldAmount: number;
    /** 珍品交易审核结束时间 */
    auditEndTime: Date;
  }
}
