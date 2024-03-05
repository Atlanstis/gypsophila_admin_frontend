declare namespace BusinessMhxy {
  /** 梦幻账号表单类型 */
  type AccountFormModel = Omit<ApiMhxy.Account, 'role' | 'sect'> & {
    role?: ApiMhxy.AccountRole['value'];
    sect?: ApiMhxy.AccountSect['value'];
  };

  /** 梦幻账号金币收支记录表单类型 */
  interface AccountGoldRecordFormModal {
    accountId?: ApiMhxy.Account['id'];
    categoryId?: ApiMhxy.GoldTradeCategory['id'];
    /** 账户当前金币数 */
    nowGold?: number;
    /** 备注 */
    remark: ApiMhxy.AccountGoldRecord['remark'];
  }

  interface AccountGoldTransferFormModal {
    fromAccountId?: ApiMhxy.Account['id'];
    toAccountId?: ApiMhxy.Account['id'];
    categoryId?: ApiMhxy.GoldTradeCategory['id'];
    /** 发起账号转金后金币数量 */
    fromNowGold?: number;
    /** 发起账号转金后金币数量 */
    toNowGold?: number;
  }
}
