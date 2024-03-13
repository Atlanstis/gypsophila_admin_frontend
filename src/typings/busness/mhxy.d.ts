declare namespace BusinessMhxy {
  /** 梦幻账号表单类型 */
  type AccountFormModel = Omit<ApiMhxy.Account, 'role' | 'sect'> & {
    role?: ApiMhxy.AccountRole['value'];
    sect?: ApiMhxy.AccountSect['value'];
  };

  type GoldRecordType = 'expenditure' | 'revenue';

  /** 梦幻账号金币收支记录表单类型 */
  interface GoldRecordFormModal {
    /** 账号 id */
    accountId?: ApiMhxy.Account['id'];
    /** 途径 id */
    channelId?: ApiMhxy.Channel['id'];
    /** 涉及道具 id */
    propCategoryId?: ApiMhxy.PropCategory['id'];
    /**  expenditure-支出,revenue-收入 */
    type: GoldRecordType;
    /** 类型 0-按涉及金额、1-按账号现有金币数 */
    amountType: 0 | 1;
    /** 涉及金额 */
    amount?: number;
    /** 账号现有金币数 */
    nowAmount?: number;
    /** 状态: 0-进行中,1-已完成 */
    status: 0 | 1;
    /** 备注 */
    remark: ApiMhxy.AccountGoldRecord['remark'];
  }

  interface GoldRecordCompleteFormModal {
    id: ApiMhxy.AccountGoldRecord['id'];
    /** 实际金额 */
    realAmount?: number;
    /** 处理 0-撤销、1-完成 */
    status: 0 | 1;
  }

  /** 单条收支记录信息 */
  type GoldRecordCompleteInfo = ApiMhxy.AccountGoldRecord & {
    realAmount: number;
  };

  /** 梦幻账号转金记录表单类型 */
  interface GoldTransferFormModal {
    fromAccountId?: ApiMhxy.Account['id'];
    toAccountId?: ApiMhxy.Account['id'];
    categoryId?: ApiMhxy.PropCategory['id'];
    /** 转出账号转金后金币数量 */
    fromNowGold?: number;
    /** 转出账号转金后金币数量 */
    toNowGold?: number;
    /** 珍品交易金额 */
    goldAmount?: number;
    /** 审核所需时间（小时） */
    auditEndHours?: number;
  }

  /** 珍品转金完成状态 */
  type GoldTransferFinishStatus = 'success' | 'fail-from-lock';

  /** 梦幻账号珍品转金记录完成时表单类型 */
  interface GoldTransferFinishFormModal {
    id: ApiMhxy.AccountGoldTransfer['id'];
    amount?: number;
    status: GoldTransferFinishStatus;
  }

  /** 道具种类表单类型 */
  type PropCategory = Pick<ApiMhxy.PropCategory, 'name' | 'isGem'> & {
    id?: ApiMhxy.PropCategory['id'];
    parentId?: ApiMhxy.PropCategory['id'];
  };

  /** 途径 */
  type Channel = Pick<ApiMhxy.Channel, 'name'> & {
    id?: ApiMhxy.Channel['id'];
    parentId?: ApiMhxy.Channel['id'];
  };
}
