declare namespace BusinessMhxy {
  /** 梦幻账号表单类型 */
  type AccountFormModel = Omit<ApiMhxy.Account, 'role' | 'sect'> & {
    role?: ApiMhxy.AccountRole['value'];
    sect?: ApiMhxy.AccountSect['value'];
  };

  /** 梦幻账号金币收支记录表单类型 */
  interface GoldRecordFormModal {
    accountId?: ApiMhxy.Account['id'];
    categoryId?: ApiMhxy.GoldTradeCategory['id'];
    /** 账户当前金币数 */
    nowGold?: number;
    /** 备注 */
    remark: ApiMhxy.AccountGoldRecord['remark'];
  }

  /** 梦幻账号转金记录表单类型 */
  interface GoldTransferFormModal {
    fromAccountId?: ApiMhxy.Account['id'];
    toAccountId?: ApiMhxy.Account['id'];
    categoryId?: ApiMhxy.GoldTradeCategory['id'];
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

  /** 贸易种类表单类型 */
  type GoldTradeCategory = Pick<ApiMhxy.GoldTradeCategory, 'name' | 'isTransfer' | 'isGem'> & {
    id?: ApiMhxy.GoldTradeCategory['id'];
  };
}
