declare namespace BusinessMhxy {
  /** 梦幻账号表单类型 */
  type AccountFormModel = Omit<ApiMhxy.Account, 'role' | 'sect'> & {
    /** 角色 */
    role?: ApiMhxy.AccountRole['value'];
    /** 门派 */
    sect?: ApiMhxy.AccountSect['value'];
    /** 分组 id */
    groupId?: ApiMhxy.AccountGroup['id'];
    /** 分组备注 */
    groupRemark: ApiMhxy.AccountGroupItem['remark'];
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
    amount?: number | null;
    /** 账号现有金币数 */
    nowAmount?: number | null;
    /** 账号现有被锁金币数 */
    nowLockAmount?: number | null;
    /** 状态: 0-进行中,1-已完成 */
    status: 0 | 1;
    /** 备注 */
    remark: ApiMhxy.AccountGoldRecord['remark'];
  }

  /** 转金记录处理表单类型 */
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
    propCategoryId?: ApiMhxy.PropCategory['id'];
    /** 转出账号转金后金币数量 */
    fromNowGold?: number;
    /** 转出账号转金后金币数量 */
    toNowGold?: number;
    /** 珍品交易金额 */
    goldAmount?: number;
  }

  /** 梦幻账号珍品转金记录完成时表单类型 */
  interface GoldTransferFinishFormModal {
    id: ApiMhxy.AccountGoldTransfer['id'];
    amount?: number;
    status: 'success' | 'fail_from_lock';
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

  /** 账号分组表单 */
  type AccountGroupFormModel = Pick<ApiMhxy.AccountGroup, 'name'> & {
    id: null | number;
  };

  /** 转金策略-表单 */
  type GoldTransferPolicyFormModel = Partial<
    Omit<ApiMhxy.GoldTransferPolicy, 'propCategory'> & {
      propCategoryId?: ApiMhxy.PropCategory['id'];
    }
  >;

  /** 转金策略-应用到账号表单 */
  type GoldTransferPolicyApplyFormModel = Partial<
    Omit<ApiMhxy.GoldTransferPolicyApply, 'account' | 'policy' | 'nextExecuteTime'> & {
      nextExecuteTime: number | string;
      accountId: ApiMhxy.Account['id'];
      policyId: ApiMhxy.GoldTransferPolicy['id'];
    }
  >;
}
